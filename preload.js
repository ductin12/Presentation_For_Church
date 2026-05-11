const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadSongs: () => ipcRenderer.invoke('load-songs'),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  loadSystemFonts: () => ipcRenderer.invoke('load-system-fonts'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadBible: () => ipcRenderer.invoke('load-bible'),
  loadBibleVersions: () => ipcRenderer.invoke('load-bible-versions'),
  importBibleVersion: () => ipcRenderer.invoke('import-bible-version'),
  loadBibleXml: () => ipcRenderer.invoke('load-bible-xml'),
  loadBibleParsed: (fileName) => ipcRenderer.invoke('load-bible-parsed', fileName),
  saveSong: (song) => ipcRenderer.invoke('save-song', song),
  deleteSong: (data) => ipcRenderer.invoke('delete-song', data),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: (data) => ipcRenderer.invoke('show-save-dialog', data),
  importMedia: () => ipcRenderer.invoke('import-media'),
  loadMedia: () => ipcRenderer.invoke('load-media'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  showOpenDialogMulti: (opts) => ipcRenderer.invoke('show-open-dialog-multi', opts),
  importSongsFromFile: (filePaths) => ipcRenderer.invoke('import-songs-from-file', filePaths),
  openLiveWindow: () => ipcRenderer.invoke('open-live-window'),
  closeLiveWindow: () => ipcRenderer.invoke('close-live-window'),
  liveSendContent: (data) => ipcRenderer.invoke('live-send-content', data),
  liveSendBackground: (data) => ipcRenderer.invoke('live-send-background', data),
  liveSendClear: () => ipcRenderer.invoke('live-send-clear'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  getCpuUsage: () => ipcRenderer.invoke('get-cpu-usage'),
  onLiveWindowClosed: (callback) => {
    ipcRenderer.removeAllListeners('live-window-closed');
    ipcRenderer.on('live-window-closed', callback);
  },
  onLiveWindowOpened: (callback) => {
    ipcRenderer.removeAllListeners('live-window-opened');
    ipcRenderer.on('live-window-opened', callback);
  },
  onMenuAction: (callback) => {
    ipcRenderer.removeAllListeners('menu-action');
    ipcRenderer.on('menu-action', callback);
  },
  onLiveUpdateContent: (callback) => {
    ipcRenderer.removeAllListeners('live-update-content');
    ipcRenderer.on('live-update-content', callback);
  },
  onLiveUpdateBackground: (callback) => {
    ipcRenderer.removeAllListeners('live-update-background');
    ipcRenderer.on('live-update-background', callback);
  },
  onLiveClear: (callback) => {
    ipcRenderer.removeAllListeners('live-clear');
    ipcRenderer.on('live-clear', callback);
  }
});
