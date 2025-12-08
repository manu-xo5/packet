import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    fetcher: Fetcher
    contextMenu: {
      create: (init: { id?: string }) => Promise<string>
      remove: (arg: { menuId: string }) => Promise<boolean>
      show: (menuId: string) => Promise<void>
      appendItem: (arg: { menuId: string; label: string }) => Promise<string>
      removeItem: (arg: { menuId: string; itemId: string }) => Promise<boolean>

      onClickedItem: (handler: (ev: { itemId: string }) => void) => () => void
      // hide: (menuId: string) => ipcRenderer.invoke('...', ...args),
      // remove: (menuId: string) => Promise<void>
    }
  }
}

export {}
