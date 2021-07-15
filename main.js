// This is the entry point for the electron application

const fs = require('fs')   
const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const axios = require('axios')

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

// This is likely going to get BIG.
const fileState = {};

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

  win.loadFile('./dist/index.html');
}

function arrayBufferToString( buffer, encoding, callback ) {
  var blob = new Blob([buffer],{type:'text/plain'});
  var reader = new FileReader();
  reader.onload = function(evt){ callback(evt.target.result); };
  reader.readAsText(blob, encoding);
}

async function downloadFile(url) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
  })

  // pipe the result stream into a file on disc
  response.data.pipe(Fs.createWriteStream(path))

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })

    response.data.on('error', () => {
      reject()
    })
  })
}



ipcMain.on('check-urls', (event, { urls, dir }) => {
  console.log('check-urls received: ', urls);
  console.log('Directory received: ', dir);

  if (!urls || !Array.isArray(urls)) {
    console.log("bad urls value detected...returning...");
    event.returnValue = null;
  }
  else {
    // Download each file, to `${app.getPath('appData')}\twic-sync` (use path for this)
    // Only download what we dont have

    // For each file in the appData path
    // Open the zip, read contents
    // And write the contents to the state hash
    
    // Compare each file to sync with whats in dir
    // Any file in the hash that's different from dir (or not in dir at all)
    // should be kept in the hash, the others can be discarded
  
    // Send the state hash back to the renderer to tell the UI what needs doing

    // This is just a temporary mod of arg just to make sure this works (it does)
    const reply = [urls[0]];
  
    event.returnValue = reply;
  }
});

ipcMain.on('sync-urls', (event, { urls, dir }) => {
  console.log('Sync-urls received: ', urls);
  console.log('Directory received: ', dir);

  // Do the actual saving of files here
  // Read the file contents from the state hash
  // And write them to dir

  const reply = [urls[0]];

  event.returnValue = reply;
});

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


