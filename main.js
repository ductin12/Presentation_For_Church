const { app, BrowserWindow, Menu, ipcMain, dialog, protocol, net, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { validateItem, migrateItem } = require('./src/schema');

// CPU Usage helper
let lastCpuUsage = { idle: 0, total: 0 };
function getCpuUsage() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  cpus.forEach(core => {
    for (type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });
  
  const diffIdle = idle - lastCpuUsage.idle;
  const diffTotal = total - lastCpuUsage.total;
  lastCpuUsage = { idle, total };
  
  if (diffTotal === 0) return 0;
  return Math.round(100 * (1 - diffIdle / diffTotal));
}

// 1. Storage Helpers
function safeWriteSync(filePath, data) {
  const tmpPath = filePath + '.tmp';
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, filePath);
    return true;
  } catch (e) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    return false;
  }
}

function saveAndBackupSync(filePath, data) {
  if (fs.existsSync(filePath)) {
    for (let i = 2; i >= 1; i--) {
      const old = `${filePath.replace('.json', '')}.backup.${i}.json`;
      const next = `${filePath.replace('.json', '')}.backup.${i + 1}.json`;
      if (fs.existsSync(old)) fs.renameSync(old, next);
    }
    fs.copyFileSync(filePath, `${filePath.replace('.json', '')}.backup.1.json`);
  }
  return safeWriteSync(filePath, data);
}

// 2. Global State
let userDataPath, songsFilePath, bibleFilePath, settingsFilePath, defaultMediaFolderPath, userBibleDataPath;
let liveWindow = null;
let mainWindow = null;
let globalSettings = {};
let liveWindowTargetDisplayId = null;
const bundledBibleDataPath = path.join(__dirname, 'data');
const defaultBibleXmlName = 'Bible_Vietnamese_Version_1925.xml';
const bibleMigrationMarkerPath = () => path.join(userBibleDataPath || userDataPath || app.getPath('userData'), '.bible-versions-migrated');

function bootstrapGpuAccelerationPreference() {
  try {
    const bootstrapSettingsPath = path.join(app.getPath('userData'), 'settings.json');
    if (!fs.existsSync(bootstrapSettingsPath)) return;
    const saved = JSON.parse(fs.readFileSync(bootstrapSettingsPath, 'utf8'));
    if (saved && saved.gpuAcceleration === false) {
      app.disableHardwareAcceleration();
    }
  } catch (e) {
    console.error('Failed to bootstrap GPU acceleration preference:', e);
  }
}

// 3. Helper Functions
function getMediaFolderPath() {
  return (globalSettings && globalSettings.mediaPath) ? globalSettings.mediaPath : defaultMediaFolderPath;
}

function normalizeBibleFileName(fileName) {
  return path.basename(String(fileName || '')).normalize('NFC');
}

function getBibleDataDirs() {
  return [userBibleDataPath, bundledBibleDataPath].filter(Boolean);
}

function resolveBibleXmlPath(fileName) {
  const normalizedName = normalizeBibleFileName(fileName);
  if (!normalizedName) return null;

  for (const dir of getBibleDataDirs()) {
    const directPath = path.join(dir, normalizedName);
    if (fs.existsSync(directPath)) return directPath;

    const nfdPath = path.join(dir, normalizedName.normalize('NFD'));
    if (fs.existsSync(nfdPath)) return nfdPath;
  }

  return null;
}

function listBibleXmlFiles() {
  const versions = new Map();

  for (const dir of getBibleDataDirs()) {
    if (!fs.existsSync(dir)) continue;

    let files = [];
    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      continue;
    }

    for (const file of files) {
      if (!file.toLowerCase().endsWith('.xml')) continue;

      const normalizedName = normalizeBibleFileName(file);
      if (!normalizedName || versions.has(normalizedName)) continue;

      versions.set(normalizedName, {
        fileName: normalizedName,
        fullPath: path.join(dir, file),
        source: dir === userBibleDataPath ? 'user' : 'bundled'
      });
    }
  }

  return [...versions.values()];
}

function getPreferredLiveDisplay() {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  const currentTarget = liveWindowTargetDisplayId
    ? displays.find(display => display.id === liveWindowTargetDisplayId)
    : null;

  if (currentTarget && currentTarget.id !== primaryDisplay.id) {
    return currentTarget;
  }

  const externalDisplay = displays.find(display => display.id !== primaryDisplay.id);
  return externalDisplay || primaryDisplay;
}

function listSystemFonts() {
  return [
    'Arial',
    'Arial Black',
    'Calibri',
    'Cambria',
    'Candara',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
    'Segoe UI',
    'CMG Sans'
  ];
}

function syncLiveWindowToPreferredDisplay() {
  if (!liveWindow || liveWindow.isDestroyed()) return;

  const display = getPreferredLiveDisplay();
  if (!display) return;

  const displays = screen.getAllDisplays();
  const isMultiDisplay = displays.length > 1;
  const bounds = display.workAreaBounds || display.bounds;
  liveWindowTargetDisplayId = display.id;

  if (isMultiDisplay) {
    // Multi-monitor: Fullscreen on the external display
    liveWindow.setFullScreen(false);
    liveWindow.setBounds(bounds, false);
    liveWindow.setFullScreen(true);
    liveWindow.setAlwaysOnTop(true, 'screen-saver');
    try {
      liveWindow.setSkipTaskbar(true);
      liveWindow.moveTop();
    } catch (e) {}
  } else {
    // Single monitor: 1/3 size floating window for testing
    const w = Math.floor(bounds.width / 3);
    const h = Math.floor(bounds.height / 3);
    const x = bounds.x + bounds.width - w - 50;
    const y = bounds.y + 50;
    
    liveWindow.setFullScreen(false);
    liveWindow.setBounds({ x, y, width: w, height: h }, false);
    liveWindow.setAlwaysOnTop(true, 'screen-saver');
    try {
      liveWindow.setSkipTaskbar(false);
    } catch (e) {}
  }

  if (!liveWindow.isVisible()) {
    liveWindow.show();
  }
}

function migrateBundledBibleVersionsToUserData() {
  if (!userBibleDataPath || !fs.existsSync(userBibleDataPath) || !fs.existsSync(bundledBibleDataPath)) return;
  const markerPath = bibleMigrationMarkerPath();

  try {
    if (fs.existsSync(markerPath)) return;
  } catch (e) {
    // If we cannot read the marker, fall through and try migration best-effort.
  }

  try {
    const bundledFiles = fs.readdirSync(bundledBibleDataPath).filter(file => file.toLowerCase().endsWith('.xml'));
    for (const file of bundledFiles) {
      const source = path.join(bundledBibleDataPath, file);
      const target = path.join(userBibleDataPath, normalizeBibleFileName(file));
      if (!fs.existsSync(target) && fs.existsSync(source) && fs.statSync(source).isFile()) {
        fs.copyFileSync(source, target);
      }
    }
    fs.writeFileSync(markerPath, JSON.stringify({
      migratedAt: new Date().toISOString(),
      source: bundledBibleDataPath,
      destination: userBibleDataPath
    }, null, 2), 'utf8');
  } catch (e) {
    console.error('[Bible] Failed to migrate bundled versions to userData:', e);
  }
}

function isVideo(fileName) {
  const ext = fileName.toLowerCase();
  return ext.endsWith('.mp4') || ext.endsWith('.mov') || ext.endsWith('.m4v') || ext.endsWith('.webm');
}

function isSupportedMedia(fileName) {
  const ext = fileName.toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.m4v', '.webm'].some(e => ext.endsWith(e));
}

function getMediaMimeType(fileName) {
  const ext = fileName.toLowerCase();
  if (ext.endsWith('.webm')) return 'video/webm';
  if (ext.endsWith('.mov')) return 'video/quicktime';
  if (ext.endsWith('.m4v') || ext.endsWith('.mp4')) return 'video/mp4';
  if (ext.endsWith('.png')) return 'image/png';
  if (ext.endsWith('.jpeg') || ext.endsWith('.jpg')) return 'image/jpeg';
  return 'application/octet-stream';
}

function initializeData() {
  userDataPath = app.getPath('userData');
  songsFilePath = path.join(userDataPath, 'songs.json');
  bibleFilePath = path.join(userDataPath, 'bible.json');
  settingsFilePath = path.join(userDataPath, 'settings.json');
  defaultMediaFolderPath = path.join(userDataPath, 'media');
  userBibleDataPath = path.join(userDataPath, 'bible-versions');

  if (!fs.existsSync(defaultMediaFolderPath)) fs.mkdirSync(defaultMediaFolderPath, { recursive: true });
  if (!fs.existsSync(userBibleDataPath)) fs.mkdirSync(userBibleDataPath, { recursive: true });
  migrateBundledBibleVersionsToUserData();
  
  if (!fs.existsSync(songsFilePath)) {
    const bundledSongs = path.join(__dirname, 'data', 'songs.json');
    if (fs.existsSync(bundledSongs)) {
      fs.copyFileSync(bundledSongs, songsFilePath);
    } else {
      safeWriteSync(songsFilePath, []);
    }
  }
  
  if (!fs.existsSync(bibleFilePath)) safeWriteSync(bibleFilePath, []);
  
  // Default Settings
  if (!fs.existsSync(settingsFilePath)) {
    globalSettings = {
      theme: 'dark',
      gpuAcceleration: true,
      fontFamilySong: 'CMG Sans',
      fontFamilyBible: 'Times New Roman',
      fontSize: '80px',
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
      verticalAlign: 'middle',
      textStrokeWidth: 5,
      textStrokeColor: '#000000',
      textMargin: { top: 0, right: 0, bottom: 0, left: 0 },
      textPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      mediaPath: defaultMediaFolderPath,
      shortcuts: {
        nextSlide: 'ArrowRight',
        prevSlide: 'ArrowLeft',
        clearScreen: 'Escape'
      }
    };
    safeWriteSync(settingsFilePath, globalSettings);
  } else {
    try {
      globalSettings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      if (!globalSettings.mediaPath) {
        globalSettings.mediaPath = defaultMediaFolderPath;
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }
}

function createLiveWindow() {
  const enforceLiveWindowPriority = () => {
    syncLiveWindowToPreferredDisplay();
  };

  if (liveWindow) {
    syncLiveWindowToPreferredDisplay();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('live-window-opened');
    }
    return;
  }
  
  const displays = screen.getAllDisplays();
  const isMultiDisplay = displays.length > 1;
  const display = getPreferredLiveDisplay();
  const targetBounds = display.workAreaBounds || display.bounds;
  liveWindowTargetDisplayId = display.id;

  let x = targetBounds.x;
  let y = targetBounds.y;
  let width = targetBounds.width;
  let height = targetBounds.height;

  if (!isMultiDisplay) {
    width = Math.floor(targetBounds.width / 3);
    height = Math.floor(targetBounds.height / 3);
    x = targetBounds.x + targetBounds.width - width - 50;
    y = targetBounds.y + 50;
  }

  liveWindow = new BrowserWindow({
    x, y, width, height,
    frame: false,
    fullscreen: isMultiDisplay,
    kiosk: false,
    simpleFullscreen: false,
    fullscreenable: true,
    alwaysOnTop: true,
    visibleOnAllWorkspaces: true,
    skipTaskbar: isMultiDisplay,
    autoHideMenuBar: true,
    hasShadow: false,
    show: false,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      autoplayPolicy: 'no-user-gesture-required'
    }
  });

  liveWindow.setAlwaysOnTop(true, 'screen-saver');
  liveWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  liveWindow.setMenuBarVisibility(false);
  liveWindow.on('show', enforceLiveWindowPriority);
  liveWindow.on('focus', enforceLiveWindowPriority);
  liveWindow.on('blur', () => setTimeout(enforceLiveWindowPriority, 0));
  liveWindow.loadFile('live.html');
  liveWindow.once('ready-to-show', () => {
    if (!liveWindow || liveWindow.isDestroyed()) return;
    syncLiveWindowToPreferredDisplay();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('live-window-opened');
    }
  });
  liveWindow.on('closed', () => {
    liveWindow = null;
    liveWindowTargetDisplayId = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('live-window-closed');
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required'
    }
  });

  mainWindow = win;
  win.loadFile('index.html');
  setupMenu(win);
}

function setupMenu(win) {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New Schedule', click: () => win.webContents.send('menu-action', 'new-schedule') },
        { label: 'New Song', click: () => win.webContents.send('menu-action', 'new-song') },
        { label: 'Save Schedule', accelerator: 'CmdOrCtrl+S', click: () => win.webContents.send('menu-action', 'save-schedule') },
        { label: 'Import File', accelerator: 'CmdOrCtrl+O', click: () => win.webContents.send('menu-action', 'import-file') },
        { label: 'Open Schedule', click: () => win.webContents.send('menu-action', 'open-schedule') },
        { type: 'separator' },
        { label: 'Import Media', click: () => win.webContents.send('menu-action', 'import-media') },
        { label: 'Add To Schedule', accelerator: 'CmdOrCtrl+Shift+A', click: () => win.webContents.send('menu-action', 'add-selected-to-schedule') },
        { label: 'Screen Live', accelerator: 'CmdOrCtrl+L', click: () => win.webContents.send('menu-action', 'toggle-live-window') },
        { label: 'Clear Live', accelerator: 'CmdOrCtrl+H', click: () => win.webContents.send('menu-action', 'clear-live') },
        { type: 'separator' },
        { label: 'Settings', accelerator: 'CmdOrCtrl+Shift+P', click: () => win.webContents.send('menu-action', 'open-settings') },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }]
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 4. App Lifecycle
bootstrapGpuAccelerationPreference();
app.whenReady().then(() => {
  initializeData();
  screen.on('display-added', syncLiveWindowToPreferredDisplay);
  screen.on('display-removed', syncLiveWindowToPreferredDisplay);
  screen.on('display-metrics-changed', syncLiveWindowToPreferredDisplay);

  // Register app-media:// protocol to serve local media files
  protocol.handle('app-media', (request) => {
    try {
      const match = request.url.match(/^app-media:\/\/+(.+)$/);
      if (!match) return new Response('Invalid URL', { status: 400 });
      const fileName = decodeURIComponent(match[1]).split(/[?#]/)[0].replace(/\/+$/, '');
      const fullPath = path.join(getMediaFolderPath(), fileName);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) return new Response('Not Found', { status: 404 });
      return net.fetch(pathToFileURL(fullPath).toString());
    } catch (e) { return new Response('Error', { status: 500 }); }
  });

  // --- IPC Handlers ---
  ipcMain.handle('select-folder', async () => {
    const r = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!r.canceled && r.filePaths.length > 0) return r.filePaths[0];
    return null;
  });

  ipcMain.handle('load-settings', () => {
    try {
      if (fs.existsSync(settingsFilePath)) {
        return JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return null;
  });

  ipcMain.handle('load-system-fonts', () => {
    return listSystemFonts();
  });

  ipcMain.handle('save-settings', (event, data) => {
    try {
      globalSettings = data; // Update local copy
      safeWriteSync(settingsFilePath, data);
      return { success: true };
    } catch (e) {
      console.error('Failed to save settings:', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('load-songs', () => {
    try {
      const items = JSON.parse(fs.readFileSync(songsFilePath, 'utf8') || '[]');
      return items.map(migrateItem);
    } catch (e) { return []; }
  });

  ipcMain.handle('load-bible', () => {
    try {
      const items = JSON.parse(fs.readFileSync(bibleFilePath, 'utf8') || '[]');
      return items.map(migrateItem);
    } catch (e) { return []; }
  });

  ipcMain.handle('load-bible-xml', () => {
    try {
      const p = resolveBibleXmlPath(defaultBibleXmlName) || resolveBibleXmlPath('Bible_Vietnamese.xml');
      if (p && fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf8');
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Bible book name mapping (English XML → Vietnamese)
  const bibleBookMap = {
    "Genesis": "Sáng Thế Ký", "Exodus": "Xuất Ê-díp-tô Ký", "Leviticus": "Lê-vi Ký", "Numbers": "Dân Số Ký", "Deuteronomy": "Phục Truyền Luật Lệ Ký",
    "Joshua": "Giô-suê", "Judges": "Các Quan Xét", "Ruth": "Ru-tơ", "1 Samuel": "1 Sa-mu-ên", "2 Samuel": "2 Sa-mu-ên",
    "1 Kings": "1 Các Vua", "2 Kings": "2 Các Vua", "1 Chronicles": "1 Sử Ký", "2 Chronicles": "2 Sử Ký", "Ezra": "Ê-xơ-ra",
    "Nehemiah": "Nê-hê-mi", "Esther": "Ê-xơ-tê", "Job": "Gióp", "Psalm": "Thi Thiên", "Psalms": "Thi Thiên", "Proverbs": "Châm Ngôn",
    "Ecclesiastes": "Truyền Đạo", "Song of Solomon": "Nhã Ca", "Isaiah": "Ê-sai", "Jeremiah": "Giê-rê-mi", "Lamentations": "Ca Thương",
    "Ezekiel": "Ê-xê-chi-ên", "Daniel": "Đa-ni-ên", "Hosea": "Ô-sê", "Joel": "Giô-ên", "Amos": "A-mốt",
    "Obadiah": "Áp-đia", "Jonah": "Giô-na", "Micah": "Mi-chê", "Nahum": "Na-hum", "Habakkuk": "Ha-ba-cúc",
    "Zephaniah": "Sô-phô-ni", "Haggai": "A-ghê", "Zechariah": "Xa-cha-ri", "Malachi": "Ma-la-chi", "Matthew": "Ma-thi-ơ",
    "Mark": "Mác", "Luke": "Lu-ca", "John": "Giăng", "Acts": "Công Vụ Các Sứ Đồ", "Romans": "Rô-ma",
    "1 Corinthians": "1 Cô-rinh-tô", "2 Corinthians": "2 Cô-rinh-tô", "Galatians": "Ga-la-ti", "Ephesians": "Ê-phê-sô", "Philippians": "Phi-líp",
    "Colossians": "Cô-lô-se", "1 Thessalonians": "1 Tê-sa-lô-ni-ca", "2 Thessalonians": "2 Tê-sa-lô-ni-ca", "1 Timothy": "1 Ti-mô-thê", "2 Timothy": "2 Ti-mô-thê",
    "Titus": "Tít", "Philemon": "Phi-lê-môn", "Hebrews": "Hê-bơ-rơ", "James": "Gia-cơ", "1 Peter": "1 Phi-e-rơ",
    "2 Peter": "2 Phi-e-rơ", "1 John": "1 Giăng", "2 John": "2 Giăng", "3 John": "3 Giăng", "Jude": "Giu-đe",
    "Revelation": "Khải Huyền"
  };

  const bibleBookMapReverse = Object.fromEntries(
    Object.entries(bibleBookMap).map(([en, vi]) => [vi, en])
  );

  // Standard Bible books in order (1-66) for mapping numbers to names if needed
  const bibleBooksOrdered = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew",
    "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
    "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
  ];

  const bibleBooksOrderedVi = bibleBooksOrdered.map(name => bibleBookMap[name] || name);

  function detectBibleLanguage(xmlData = '', xmlName = '') {
    const sample = `${xmlName}\n${xmlData.slice(0, 2000)}`.toLowerCase();

    if (/translation\s*=\s*["'][^"']*english|english niv|niv|esv|kjv/.test(sample)) return 'en';
    if (/translation\s*=\s*["'][^"']*vietnamese|bpt|nvb|viet|thánh kinh|kinh thánh|ban đầu thượng đế|thượng đế/.test(sample)) return 'vi';
    if (/bible_vietnamese|ban[_ -]?pho[_ -]?thong|ban[_ -]?dich[_ -]?moi|englishnivbible/i.test(xmlName)) {
      return /englishnivbible/i.test(xmlName) ? 'en' : 'vi';
    }

    const hasVietnameseDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(sample);
    if (hasVietnameseDiacritics || /thượng đế|đức chúa trời|ban đầu|buổi chiều|buổi sáng|phúc âm/i.test(sample)) {
      return 'vi';
    }

    const firstBookMatch = xmlData.match(/<(?:BIBLEBOOK|book)\s+[^>]*(?:bname|number)=['"]([^'"]+)['"]/i);
    if (firstBookMatch) {
      const bookRef = firstBookMatch[1];
      if (bibleBookMap[bookRef]) return 'en';
      if (bibleBookMapReverse[bookRef]) return 'vi';
      if (/^\d+$/.test(bookRef)) return 'unknown';
    }

    return 'unknown';
  }

  function getBibleLanguageLabel(language) {
    if (language === 'en') return 'English';
    if (language === 'vi') return 'Tiếng Việt';
    return 'Không rõ ngôn ngữ';
  }

  function getBibleVersionDisplayName(fileName, language = 'unknown') {
    const baseName = path.basename(fileName).replace(/\.xml$/i, '').replace(/_/g, ' ').trim();
    return `${baseName} - ${getBibleLanguageLabel(language)}`;
  }

  function resolveBibleBookName(bookRef, language = 'unknown') {
    if (/^\d+$/.test(String(bookRef))) {
      const idx = parseInt(bookRef, 10) - 1;
      if (language === 'en') return bibleBooksOrdered[idx] || `Book ${bookRef}`;
      if (language === 'vi') return bibleBooksOrderedVi[idx] || `Sách ${bookRef}`;
      return bibleBooksOrderedVi[idx] || bibleBooksOrdered[idx] || `Book ${bookRef}`;
    }

    if (language === 'en') {
      return bookRef;
    }

    if (language === 'vi') {
      return bibleBookMap[bookRef] || bookRef;
    }

    return bibleBookMap[bookRef] || bookRef;
  }

  ipcMain.handle('load-bible-versions', () => {
    try {
      return listBibleXmlFiles().map(({ fileName, fullPath, source }) => {
        let language = detectBibleLanguage('', fileName);
        try {
          const header = fs.readFileSync(fullPath, 'utf8').slice(0, 2000);
          const detected = detectBibleLanguage(header, fileName);
          if (detected !== 'unknown') language = detected;
        } catch (e) {
          // Keep best-effort fallback.
        }

        return {
          name: fileName.replace(/\.xml$/i, '').replace(/_/g, ' '),
          displayName: getBibleVersionDisplayName(fileName, language),
          language,
          fileName,
          source
        };
      });
    } catch (e) { return []; }
  });

  ipcMain.handle('import-bible-version', async () => {
    try {
      const r = await dialog.showOpenDialog({ 
        properties: ['openFile'], 
        filters: [{ name: 'Bible XML', extensions: ['xml'] }] 
      });
      if (!r.canceled && r.filePaths.length > 0) {
        const src = r.filePaths[0];
        const name = normalizeBibleFileName(path.basename(src));
        const dest = path.join(userBibleDataPath, name);
        if (path.resolve(src) !== path.resolve(dest)) {
          fs.copyFileSync(src, dest);
        }
        let language = 'unknown';
        try {
          const sample = fs.readFileSync(dest, 'utf8').slice(0, 2000);
          language = detectBibleLanguage(sample, name);
        } catch (e) {
          // ignore
        }
        return {
          success: true,
          name: name.replace(/\.xml$/i, '').replace(/_/g, ' '),
          displayName: getBibleVersionDisplayName(name, language),
          language,
          fileName: name,
          source: 'user'
        };
      }
      return { success: false, error: 'No file selected' };
    } catch (e) {
      console.error('[Bible] Import failed:', e);
      return { success: false, error: e.message || 'Import failed' };
    }
  });

  ipcMain.handle('load-bible-parsed', (event, fileName) => {
    const xmlName = normalizeBibleFileName(fileName || defaultBibleXmlName);
    const cacheName = `bible-cache-${xmlName.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`;
    const cachePath = path.join(userDataPath, cacheName);
    const xmlPath = resolveBibleXmlPath(xmlName);
    const sourceStat = xmlPath && fs.existsSync(xmlPath) ? fs.statSync(xmlPath) : null;

    console.log(`[Bible] Loading Version: ${xmlName}`);

    // Try loading from cache first
    try {
      if (fs.existsSync(cachePath)) {
        const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

        const cachedItems = Array.isArray(cached)
          ? cached
          : (cached && Array.isArray(cached.items) ? cached.items : null);

        if (cachedItems && cachedItems.length > 0) {
          const cachedSource = cached && !Array.isArray(cached) ? cached.source : null;
          const cacheMatchesSource = !!(sourceStat && cachedSource && cachedSource.mtimeMs === sourceStat.mtimeMs && cachedSource.size === sourceStat.size);

          if (!sourceStat || cacheMatchesSource) {
            console.log(`[Bible] ${cachedItems.length} chapters loaded from cache.`);
            return cachedItems;
          }
        }

        fs.unlinkSync(cachePath);
      }
    } catch (e) {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }

    // Parse XML and build cache
    try {
      if (!xmlPath) {
        console.error(`[Bible] File not found: ${xmlName}`);
        return [];
      }

      let xmlData = fs.readFileSync(xmlPath, 'utf8');
      console.log(`[Bible] Reading file, size: ${xmlData.length} bytes`);

      // Fix legacy encoding for Vietnamese
      xmlData = xmlData.replace(/\u00D0/g, '\u0110');
      const bibleLanguage = detectBibleLanguage(xmlData, xmlName);
      console.log(`[Bible] Detected language: ${bibleLanguage}`);

      const bibleLibrary = [];

      // Improved robust regex
      const bookRegex = /<(BIBLEBOOK|book)\s+([^>]*?)>([\s\S]*?)<\/\1>/gi;
      const chapterRegex = /<(CHAPTER|chapter)\s+([^>]*?)>([\s\S]*?)<\/\1>/gi;
      const verseRegex = /<(VERS|verse)\s+([^>]*?)>([\s\S]*?)<\/\1>/gi;

      let bookMatch;
      while ((bookMatch = bookRegex.exec(xmlData)) !== null) {
        const bookAttrs = bookMatch[2];
        const bookContent = bookMatch[3];

        // Extract bname or number from attributes
        const nameMatch = bookAttrs.match(/(bname|number)=['"]([^'"]*)['"]/i);
        if (!nameMatch) continue;

        const attrValue = nameMatch[2];
        const bookTitle = resolveBibleBookName(attrValue, bibleLanguage).trim();

        chapterRegex.lastIndex = 0;
        let chapterMatch;
        while ((chapterMatch = chapterRegex.exec(bookContent)) !== null) {
          const chapterAttrs = chapterMatch[2];
          const chapterContent = chapterMatch[3];

          const cNumMatch = chapterAttrs.match(/(cnumber|number)=['"]([^'"]*)['"]/i);
          if (!cNumMatch) continue;
          const cnumber = cNumMatch[2];

          let versesText = '';
          verseRegex.lastIndex = 0;
          let verseMatch;
          while ((verseMatch = verseRegex.exec(chapterContent)) !== null) {
            const vAttrs = verseMatch[2];
            const vContent = verseMatch[3];

            const vNumMatch = vAttrs.match(/(vnumber|number)=['"]([^'"]*)['"]/i);
            const vnumber = vNumMatch ? vNumMatch[2] : '';

            const text = vContent.replace(/<[^>]*>/g, '').trim();
            versesText += `${vnumber} ${text}\n\n`;
          }

          bibleLibrary.push({
            title: `${bookTitle} ${cnumber}`,
            lyrics: versesText.trim(),
            type: 'bible'
          });
        }
      }

      if (bibleLibrary.length > 0) {
        safeWriteSync(cachePath, {
          source: sourceStat ? {
            fileName: xmlName,
            size: sourceStat.size,
            mtimeMs: sourceStat.mtimeMs
          } : null,
          items: bibleLibrary
        });
        console.log(`[Bible] Successfully parsed ${bibleLibrary.length} chapters.`);
      } else {
        console.warn(`[Bible] Warning: 0 chapters parsed from ${xmlName}.`);
      }
      return bibleLibrary;
    } catch (e) {
      console.error('[Bible] Critical error parsing XML:', e);
      return [];
    }
  });

  ipcMain.handle('save-song', (event, rawSong) => {
    try {
      let song = { ...rawSong };
      if (!song.id) song.id = Date.now();
      song = migrateItem(song);

      const validation = validateItem(song);
      if (!validation.valid) throw new Error(`Invalid data: ${validation.errors.join(', ')}`);

      const filePath = song.type === 'bible' ? bibleFilePath : songsFilePath;
      let items = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]') : [];
      
      const idx = items.findIndex(s => s.id === song.id);
      if (idx !== -1) items[idx] = song; else items.push(song);
      
      saveAndBackupSync(filePath, items);
      return { success: true, item: song, list: items };
    } catch (e) { throw e; }
  });

  ipcMain.handle('delete-song', (event, data) => {
    try {
      const filePath = data.type === 'bible' ? bibleFilePath : songsFilePath;
      let items = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
      items = items.filter(i => i.id !== data.id);
      saveAndBackupSync(filePath, items);
      return items;
    } catch (e) { throw e; }
  });

  ipcMain.handle('show-open-dialog', async () => {
    const r = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Worship Schedule', extensions: ['bcsch'] }] });
    if (!r.canceled && r.filePaths.length > 0) return { filePath: r.filePaths[0], data: JSON.parse(fs.readFileSync(r.filePaths[0], 'utf8')) };
    return null;
  });

  ipcMain.handle('show-save-dialog', async (e, d) => {
    const r = await dialog.showSaveDialog({ filters: [{ name: 'Worship Schedule', extensions: ['bcsch'] }] });
    if (!r.canceled && r.filePath) { safeWriteSync(r.filePath, d); return r.filePath; }
    return null;
  });

  ipcMain.handle('import-media', async () => {
    const r = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'], filters: [{ name: 'Media Files', extensions: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'm4v', 'webm'] }] });
    const mediaPath = getMediaFolderPath();
    if (!r.canceled && r.filePaths.length > 0) {
      return r.filePaths.map(p => {
        const name = path.basename(p);
        const dest = path.join(mediaPath, name);
        fs.copyFileSync(p, dest);
        return { name, path: dest, url: pathToFileURL(dest).toString(), type: isVideo(name) ? 'video' : 'image', mimeType: getMediaMimeType(name) };
      });
    }
    return null;
  });

  ipcMain.handle('load-media', () => {
    try {
      const mediaPath = getMediaFolderPath();
      if (!fs.existsSync(mediaPath)) return [];
      return fs.readdirSync(mediaPath)
        .filter(f => fs.statSync(path.join(mediaPath, f)).isFile() && isSupportedMedia(f))
        .map(f => {
          const fullPath = path.join(mediaPath, f);
          return { name: f, path: fullPath, url: pathToFileURL(fullPath).toString(), type: isVideo(f) ? 'video' : 'image', mimeType: getMediaMimeType(f) };
        });
    } catch (e) { return []; }
  });

  ipcMain.handle('open-live-window', () => { createLiveWindow(); return true; });
  ipcMain.handle('close-live-window', () => {
    if (liveWindow && !liveWindow.isDestroyed()) {
      liveWindow.destroy();
    }
    return true;
  });
  ipcMain.handle('live-send-content', (e, d) => {
    if (liveWindow && !liveWindow.isDestroyed()) {
      syncLiveWindowToPreferredDisplay();
      liveWindow.webContents.send('live-update-content', d);
    }
  });
  ipcMain.handle('live-send-background', (e, d) => {
    if (liveWindow && !liveWindow.isDestroyed()) {
      syncLiveWindowToPreferredDisplay();
      liveWindow.webContents.send('live-update-background', d);
    }
  });
  ipcMain.handle('live-send-clear', () => {
    if (liveWindow && !liveWindow.isDestroyed()) {
      syncLiveWindowToPreferredDisplay();
      liveWindow.webContents.send('live-clear');
    }
  });

  ipcMain.handle('quit-app', () => {
    app.quit();
    return true;
  });

  ipcMain.handle('get-cpu-usage', () => {
    return getCpuUsage();
  });

  ipcMain.handle('show-open-dialog-multi', async (event, options) => {
    const result = await dialog.showOpenDialog({ ...options, properties: ['openFile', 'multiSelections'] });
    return result;
  });

  ipcMain.handle('import-songs-from-file', async (event, filePaths) => {
    let mammoth = null;
    try { mammoth = require('mammoth'); } catch (e) { /* not installed */ }
    const results = [];
    for (const filePath of filePaths) {
      const ext = path.extname(filePath).toLowerCase();
      const title = path.basename(filePath, ext);
      let lyrics = '';
      if (ext === '.txt') {
        lyrics = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trim();
        results.push({ title, lyrics, ext });
      } else if (ext === '.docx' && mammoth) {
        const r = await mammoth.extractRawText({ path: filePath });
        lyrics = r.value.trim();
        results.push({ title, lyrics, ext });
      } else if (ext === '.json') {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (Array.isArray(content)) {
            // Persistent Save: Merge imported songs into local songs.json
            const currentItems = JSON.parse(fs.readFileSync(songsFilePath, 'utf8') || '[]');
            const currentIds = new Set(currentItems.map(s => s.id));
            let addedCount = 0;

            for (let song of content) {
              song = migrateItem(song);
              if (!song.id) song.id = Date.now() + Math.random();
              if (!currentIds.has(song.id)) {
                currentItems.push(song);
                currentIds.add(song.id);
                addedCount++;
              }
            }
            if (addedCount > 0) {
              saveAndBackupSync(songsFilePath, currentItems);
              console.log(`Imported and saved ${addedCount} songs from JSON array.`);
            }
            results.push({ type: 'json-array', data: content, imported: true });
          } else {
            results.push({ type: 'json-object', data: content });
          }
        } catch (e) {
          console.error('Failed to parse JSON file:', filePath, e);
        }
      }
    }
    return results;
  });

  createWindow();

});


app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', () => {
  if (liveWindow && !liveWindow.isDestroyed()) {
    liveWindow.destroy();
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.destroy();
  }
});
