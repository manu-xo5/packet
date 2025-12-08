import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    fetcher: Fetcher
    contextMenu: {
      create: (init: { id?: string }) => Promise<string>
      show: (menuId: string) => Promise<void>
      // hide: (menuId: string) => ipcRenderer.invoke('...', ...args),
      // remove: (menuId: string) => Promise<void>
    }
  }
}

export {}
