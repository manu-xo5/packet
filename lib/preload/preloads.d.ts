import { Fetcher } from '@/lib/fetch-class'
import { AppendItemArgs } from '../main/context-menu'

type Arg<T extends unknown[]> = T extends [Electron.IpcMainInvokeEvent, ...infer Rest] ? Rest : T

declare global {
  interface Window {
    fetcher: Fetcher
    contextMenu: {
      create: (init: { id?: string }) => Promise<string>
      remove: (arg: { menuId: string }) => Promise<boolean>
      show: (menuId: string) => Promise<void>
      appendItem: (...arg: Arg<AppendItemArgs>) => Promise<{ id: string; subMenuId: string }>
      removeItem: (arg: { menuId: string; itemId: string }) => Promise<boolean>

      onClickedItem: (handler: (ev: { itemId: string }) => void) => () => void
      // hide: (menuId: string) => ipcRenderer.invoke('...', ...args),
      // remove: (menuId: string) => Promise<void>
    }
  }
}

export {}
