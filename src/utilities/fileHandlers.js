// exposed as part of preload.js (contextBridge)
export function checkValidDirectory(dir) {
  return window.electron.checkDirectory(dir);
}

export function checkUrlsForSync(urls, dir) {
  return window.electron.checkUrls(urls, dir);
}

export function performSync(urls, dir) {
  return window.electron.syncUrls(urls, dir);
}

export function registerHandler(event, handler) {
  return window.electron.registerHandler(event, handler);
}
