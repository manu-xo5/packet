import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('fetcher', (...args) => ipcRenderer.invoke('fetcher', ...args))

contextBridge.exposeInMainWorld('contextMenu', {
  create: (...args) => ipcRenderer.invoke('contextMenu::create', ...args),
  show: (...args) => ipcRenderer.invoke('contextMenu::show', ...args),
  // hide: (...args) => ipcRenderer.invoke('...', ...args),
  // remove: (...args) => ipcRenderer.invoke('contextMenu::remove', ...args),
})
