import { BrowserWindow, dialog, ipcMain } from 'electron'
import { Menu as ElectronMenu } from 'electron/main'

type MenuInit = {
  id?: string
}

type Menu = {
  id: string
  contextMenu: Electron.Menu
}

const context = new Map<string, Menu>()

function createMenu(init: MenuInit) {
  const contextMenu = ElectronMenu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' },
    { role: 'quit' },
    { role: 'fileMenu' },
  ])

  const menu: Menu = {
    id: init.id ?? crypto.randomUUID(),
    contextMenu: contextMenu,
  }

  // new r
  // new f
  // delete
  // rename
  // duplicate
  // copy as cUrl

  context.set(menu.id, menu)

  return menu.id
}

function registerContextMenuIpc() {
  ipcMain.handle('contextMenu::create', (_e, menuInit: MenuInit) => {
    return createMenu(menuInit)
  })

  ipcMain.handle('contextMenu::show', (_e, menuId: string) => {
    console.log('showing menu ' + menuId + '\n\n')

    const menu = context.get(menuId)
    if (!menu) {
      dialog.showErrorBox(
        'ContextMenu not found',
        "DEVELOPMENT: the context menu you are trying to access doesn't exists in context"
      )

      return
    }

    menu.contextMenu.popup()
  })
}

export { registerContextMenuIpc }
