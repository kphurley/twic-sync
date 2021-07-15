// exposed as part of preload.js (contextBridge)

export function checkUrlsForSync(urls, dir) {
  return window.electron.checkUrls(urls, dir);
}

export function performSync(urls, dir) {
  return window.electron.syncUrls(urls, dir);
}
