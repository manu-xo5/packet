import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    platform: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'

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
