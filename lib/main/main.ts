import { createFetcher } from '@/lib/fetch-class'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain } from 'electron'
import { homedir } from 'node:os'
import * as path from 'node:path'
import { SimpleFileCookieStore } from '../tough-file-store'
import { createAppWindow } from './app'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.packet')
  createAppWindow()

  const storage = new SimpleFileCookieStore(path.join(homedir(), 'com.packet.cookie'))

  const fetcher = createFetcher({ storage })

  ipcMain.handle('fetcher', (_, ...args) => {
    const [input, init] = args
    return fetcher(input, init)
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
