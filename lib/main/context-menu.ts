import { BrowserWindow, dialog, ipcMain, Menu, MenuItem, nativeImage } from 'electron'
import { Menu as ElectronMenu } from 'electron/main'

type MenuInit = {
  id?: string
}

type Menu = {
  id: string
  contextMenu: Electron.Menu
  items: MenuItem[]
  append: (menuItem: Electron.MenuItem) => void
  remove: (itemId: string) => boolean
}

const context = new Map<string, Menu>()

function createMenu(init: MenuInit) {
  const make = () => {
    menu.contextMenu = ElectronMenu.buildFromTemplate(menu.items)
  }

  const append = (menuItem: Electron.MenuItem) => {
    menu.items.push(menuItem)
    menu.contextMenu.append(menuItem)
  }

  const remove = (itemId: string) => {
    const hasDeleted = menu.items.filter((i) => i.id === itemId).length > 0

    menu.items = menu.items.filter((i) => i.id !== itemId)
    make()

    return hasDeleted
  }

  const menu: Menu = {
    id: init.id ?? crypto.randomUUID(),
    items: [] as MenuItem[],
    contextMenu: ElectronMenu.buildFromTemplate([]),
    append,
    remove,
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

function getMenuById(id: string) {
  const menu = context.get(id)
  if (!menu) {
    const err = new Error("DEVELOPMENT: the context menu you are trying to access doesn't exists in context")
    err.name = 'ContextMenu not found'

    throw err
  }

  return menu
}

function handle(name: string, handler: (e: Electron.IpcMainInvokeEvent, ...args: any[]) => unknown | Promise<unknown>) {
  ipcMain.handle(name, async (e, ...args) => {
    try {
      return await Promise.try(() => handler(e, ...args))
    } catch (err) {
      const error = err instanceof Error ? err : Error(String(err))
      console.error(error)
      throw error
    }
  })
}

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

function registerContextMenuIpc(win: BrowserWindow) {
  handle('contextMenu::create', (_e, menuInit: MenuInit) => {
    return createMenu(menuInit)
  })

  handle('contextMenu::remove', (_e, { menuId }: { menuId: string }) => {
    const hasDeleted = menuId in context

    delete context[menuId]

    return hasDeleted
  })

  handle('contextMenu::show', (_e, menuId: string) => {
    const menu = getMenuById(menuId)

    menu.contextMenu.popup()
  })

  ipcMain.handle('contextMenu::appendItem', (...[_, { menuId, icon, submenu, ...menuItemOptions }]: AppendItemArgs) => {
    const menu = getMenuById(menuId)
    const id = crypto.randomUUID()
    const subMenuId = crypto.randomUUID()
    const submenuV = submenu
      ? (() => {
          createMenu({ id: subMenuId })
          return getMenuById(subMenuId).contextMenu
        })()
      : undefined

    console.log(submenu, submenuV)

    const menuItem = new MenuItem({
      id: id,
      click: () => {
        win.webContents.send('contextMenu::clickedItem', {
          itemId: id,
        })
      },
      icon: icon && nativeImage.createFromNamedImage(icon),
      submenu: submenuV,
      ...menuItemOptions,
    })

    menu.append(menuItem)
    return {
      id,
      subMenuId: submenu && subMenuId,
    }
  })

  ipcMain.handle('contextMenu::removeItem', (_e, { menuId, itemId }: { menuId: string; itemId: string }) => {
    const menu = getMenuById(menuId)

    return menu.remove(itemId)
  })
}

export { registerContextMenuIpc }
