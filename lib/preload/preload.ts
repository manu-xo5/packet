import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('fetcher', (...args) => ipcRenderer.invoke('fetcher', ...args))

contextBridge.exposeInMainWorld('contextMenu', {
  create: (...args) => ipcRenderer.invoke('contextMenu::create', ...args),
  remove: (...args) => ipcRenderer.invoke('contextMenu::remove', ...args),
  show: (...args) => ipcRenderer.invoke('contextMenu::show', ...args),
  appendItem: (...args) => ipcRenderer.invoke('contextMenu::appendItem', ...args),
  removeItem: (...args) => ipcRenderer.invoke('contextMenu::removeItem', ...args),
  onClickedItem: (handler) => {
    const wrappedHandler = (_, ...args) => handler(...args)
    ipcRenderer.on('contextMenu::clickedItem', wrappedHandler)

    return () => ipcRenderer.off('contextMenu::clickedItem', wrappedHandler)
  },
  // hide: (...args) => ipcRenderer.invoke('...', ...args),
})
