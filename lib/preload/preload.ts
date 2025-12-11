import { contextBridge, ipcRenderer } from 'electron'
import fs from 'fs/promises'

ipcRenderer.setMaxListeners(20)

const getFlag = (name: string) => {
  const args = process.argv
  const nameFlag = `--${name}`
  const dataArg = args.find((arg) => arg.startsWith(nameFlag + '='))

  if (dataArg) {
    return dataArg.substring((nameFlag + '=').length)
  }

  return undefined
}

contextBridge.exposeInMainWorld('fetcher', (...args: any[]) => ipcRenderer.invoke('fetcher', ...args))

contextBridge.exposeInMainWorld('platform', process.platform)
contextBridge.exposeInMainWorld('cwd', getFlag('cwd'))

contextBridge.exposeInMainWorld('contextMenu', {
  onClickedItem: (handler: any) => {
    const wrappedHandler = (_: any, ...args: any[]) => handler(...args)
    ipcRenderer.on('contextMenu::clickedItem', wrappedHandler)

    return () => ipcRenderer.off('contextMenu::clickedItem', wrappedHandler)
  },
  render: (...args: any[]) => ipcRenderer.invoke('contextMenu::render', ...args),
})

/** fs **/

contextBridge.exposeInMainWorld('fs', {
  async readFile(path: any) {
    try {
      const data = await fs.readFile(String(path), 'utf8')

      return {
        ok: true,
        data,
      } as const
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      } as const
    }
  },

  async writeFile(path: any, data: any) {
    try {
      await fs.writeFile(String(path), String(data))
    } catch (err) {
      console.error(err)
      throw new Error('Failed to write file')
    }
  },

  writeUserData: (...args: any[]) => ipcRenderer.invoke('fs::writeUserData', ...args),
})

contextBridge.exposeInMainWorld('dialog', {
  showDirectoryPicker: async () => ipcRenderer.invoke('dialog::showDirectoryPicker'),
})
