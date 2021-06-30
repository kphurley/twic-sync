// This is the entry point for the electron application

const path = require('path');
const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
  createWindow()

  // Windows/Linux
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  });

  // MacOS
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});


