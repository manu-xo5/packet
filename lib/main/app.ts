import { BrowserWindow, shell, app } from 'electron'
import { join } from 'path'
import appIcon from '@/resources/build/icon.png?asset'
import { registerResourcesProtocol } from './protocols'

export function createAppWindow() {
  registerResourcesProtocol()

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: appIcon,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      x: 12,
      y: 12,
    },
    title: 'Packet',
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
    vibrancy: 'sidebar',
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
