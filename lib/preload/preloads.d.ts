import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    fetcher: Fetcher
    contextMenu: {
      onClickedItem: (handler: (ev: { itemId: string }) => void) => () => void
      // hide: (menuId: string) => ipcRenderer.invoke('...', ...args),
      // remove: (menuId: string) => Promise<void>
      render: (vl: any) => Promise<void>
    }
  }
}

export {}
