// This is the entry point for the electron application

const path = require('path');
const { app, BrowserWindow, shell } = require('electron');

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

function createWindow () {
  const win = new BrowserWindow({
    width: 620,
    height: 440,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // This handles opening external links in the desktop's default browser
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  // This removes the menu bar on Windows
  // We should only do this for production
  // win.setMenu(null);

  win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS, { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

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


