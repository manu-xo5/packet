import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('fetcher', (...args) => ipcRenderer.invoke('fetcher', ...args))

contextBridge.exposeInMainWorld('platform', process.platform)

contextBridge.exposeInMainWorld('contextMenu', {
  onClickedItem: (handler) => {
    const wrappedHandler = (_, ...args) => handler(...args)
    ipcRenderer.on('contextMenu::clickedItem', wrappedHandler)

    return () => ipcRenderer.off('contextMenu::clickedItem', wrappedHandler)
  },
  render: (...args) => ipcRenderer.invoke('contextMenu::render', ...args),
})
