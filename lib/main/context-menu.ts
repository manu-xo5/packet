import { BrowserWindow, ipcMain, MenuItem } from 'electron'
import { Menu as ElectronMenu } from 'electron/main'

type Simp<T> = {
  [Key in keyof T]: T[Key]
} & {}

export type AppendItemArgs = [
  Electron.IpcMainInvokeEvent,
  Simp<
    { menuId: string; icon?: string; submenu: boolean } & Pick<
      Electron.MenuItemConstructorOptions,
      'label' | 'sublabel' | 'type' | 'enabled' | 'checked' | 'role'
    >
  >,
]

function registerContextMenuIpc() {
  ipcMain.handle('contextMenu::render', (e, vl) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return

    const recCreateMenu = (v: any) => {
      if (!v) return undefined

      const par = new ElectronMenu()

      v.items.forEach((i: any) => {
        const item = new MenuItem({
          label: i.label,
          click: () => {
            win.webContents.send('contextMenu::clickedItem', {
              itemId: i.itemId,
            })
          },
          submenu: recCreateMenu(vl[i.subMenuId]),
        })

        par.append(item)
      })

      return par
    }

    recCreateMenu(vl['root'])?.popup()
  })
}

export { registerContextMenuIpc }
