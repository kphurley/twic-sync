const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    checkDirectory: (dir) => {
      return ipcRenderer.sendSync('check-directory', { dir })
    },
    checkUrls: (urls, dir) => {
      return ipcRenderer.sendSync('check-urls', { urls, dir })
    },
    syncUrls: (urls, dir) => {
      return ipcRenderer.send('sync-urls', { urls, dir })
    },
    registerHandler: (event, handler) => ipcRenderer.on(event, (e, arg) => handler(arg))
  }
);
