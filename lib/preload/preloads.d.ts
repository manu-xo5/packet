import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    platform: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'
    cwd: string

    fetcher: Fetcher

    fs: {
      readFile: (path: string) => Promise<
        | {
            ok: true
            data: string
          }
        | {
            ok: false
            error: string
          }
      >

      writeFile: (path: string, data: string) => Promise<void>
      writeUserData: (fileName: string, data: string) => Promise<void>
    }

    contextMenu: {
      onClickedItem: (handler: (ev: { itemId: string }) => void) => () => void
      // hide: (menuId: string) => ipcRenderer.invoke('...', ...args),
      // remove: (menuId: string) => Promise<void>
      render: (vl: any) => Promise<void>
    }

    dialog: {
      showDirectoryPicker: () => Promise<string | undefined>
    }
  }
}

export {}
