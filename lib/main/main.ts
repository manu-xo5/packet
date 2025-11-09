import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createAppWindow } from './app'

export type FetcherResponse = {
  headers: Record<string, string>
  text: string
  ok: boolean
  status: number
  statusText: string
  url: string
}

async function responseToJson(r: Response) {
  const response: FetcherResponse = {
    headers: Object.fromEntries(r.headers.entries()),
    text: await r.text(),
    ok: r.ok,
    status: r.status,
    statusText: r.statusText,
    url: r.url,
  }

  return response
}

async function handleFetcher(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const res = await fetch(input, init)
    return {
      ok: true,
      value: await responseToJson(res),
    } as const
  } catch (err) {
    if (err instanceof Error) {
      return {
        ok: false,
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: err.cause,
        },
      } as const
    } else {
      const newErr = new Error(String(err))

      return {
        ok: false,
        error: {
          name: newErr.name,
          message: newErr.message,
          stack: newErr.stack,
          cause: newErr.cause,
        },
      } as const
    }
  }
}
export type Fetcher = typeof handleFetcher

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  createAppWindow()

  ipcMain.handle('fetcher', (_, ...args) => {
    const [input, init] = args
    return handleFetcher(input, init)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
