import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('fetcher', (...args) => ipcRenderer.invoke('fetcher', ...args))
