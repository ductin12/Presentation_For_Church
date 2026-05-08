const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadSongs: () => ipcRenderer.invoke('load-songs'),
  loadBible: () => ipcRenderer.invoke('load-bible'),
  loadBibleXml: () => ipcRenderer.invoke('load-bible-xml'),
  loadBibleParsed: () => ipcRenderer.invoke('load-bible-parsed'),
  saveSong: (song) => ipcRenderer.invoke('save-song', song),
  deleteSong: (data) => ipcRenderer.invoke('delete-song', data),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: (data) => ipcRenderer.invoke('show-save-dialog', data),
  importMedia: () => ipcRenderer.invoke('import-media'),
  loadMedia: () => ipcRenderer.invoke('load-media'),
  showOpenDialogMulti: (opts) => ipcRenderer.invoke('show-open-dialog-multi', opts),
  importSongsFromFile: (filePaths) => ipcRenderer.invoke('import-songs-from-file', filePaths),
  openLiveWindow: () => ipcRenderer.invoke('open-live-window'),
  closeLiveWindow: () => ipcRenderer.invoke('close-live-window'),
  liveSendContent: (data) => ipcRenderer.invoke('live-send-content', data),
  liveSendBackground: (data) => ipcRenderer.invoke('live-send-background', data),
  liveSendClear: () => ipcRenderer.invoke('live-send-clear'),
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
  },
  onUpdateAvailable: (callback) => {
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.on('update-available', callback);
  },
  onUpdateProgress: (callback) => {
    ipcRenderer.removeAllListeners('update-progress');
    ipcRenderer.on('update-progress', callback);
  },
  onUpdateDownloaded: (callback) => {
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.on('update-downloaded', callback);
  },
  installUpdate: () => ipcRenderer.invoke('install-update')
});