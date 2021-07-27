// This is the entry point for the electron application

const fs = require('fs')   
const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const axios = require('axios')

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

  win.loadFile('./dist/index.html');
}

function arrayBufferToString( buffer, encoding, callback ) {
  var blob = new Blob([buffer],{type:'text/plain'});
  var reader = new FileReader();
  reader.onload = function(evt){ callback(evt.target.result); };
  reader.readAsText(blob, encoding);
}

// We need this as a simple throttle mechanism when downloading files
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resolvePromisesSerially(funcs) {
  return funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
}

function downloadFile(url) {
  return axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
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
    const urlStatuses = urls.map((url) => {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = path.join(dir, fileName);

      console.log(filePath);

      if (fs.existsSync(filePath)) {
        return { url, status: "synched" };
      }
      else {
        return { url, status: "unsynched" };
      }
    });

    // We can't send back an object, so send as a JSON string
    event.returnValue = JSON.stringify(urlStatuses);
  }
});

ipcMain.on('sync-urls', (event, { urls, dir }) => {
  console.log('Sync-urls received: ', urls);
  console.log('Directory received: ', dir);

  // Do the actual saving of files here
  // Only download what we dont have
  // This is very slow if we don't have any of the files...
  const urlPromises = urls.map((url) => () => {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = path.join(dir, fileName);

    if (!fs.existsSync(filePath)) {
      console.log("Downloading to ", filePath, " ...");

      // Need to throttle the requests to avoid timeouts
      return sleep(100)
      .then(() => {
        return downloadFile(url);
      })
      .then((res) => {
        const arrayBuffer = res.data;

        let status;
        try {
          fs.appendFileSync(filePath, Buffer.from(arrayBuffer));
          console.log("Download to ", filePath, " completed.");
          status = "synched";
        } catch (err) {
          console.log("couldn't save file");
          console.log(err);
          status = "errored";
        }
        
        return { url, status };
      })
      .catch((err) => {
        return { url, status: "errored", error: err };
      })
    }
    else {
      return Promise.resolve({ url, status: "found" });
    }
  });

  // Perform each save in serial
  resolvePromisesSerially(urlPromises).then((resolved) => {
    resolved.forEach((resolvedValue) => {
      if(resolvedValue) console.log(resolvedValue);
    });

    // Send back the response to the UI with the state of each url
    event.returnValue = resolved;
  });
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


