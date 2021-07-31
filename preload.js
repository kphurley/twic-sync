const { app, contextBridge, ipcRenderer } = require('electron');

// This works for sending
// registerHandler also appears to work as well
contextBridge.exposeInMainWorld(
  'electron',
  {
    checkUrls: (urls, dir) => {
      return ipcRenderer.sendSync('check-urls', { urls, dir })
    },
    syncUrls: (urls, dir) => {
      return ipcRenderer.send('sync-urls', { urls, dir })
    },
    registerHandler: (event, handler) => ipcRenderer.on(event, (e, arg) => handler(arg))
  }
);
