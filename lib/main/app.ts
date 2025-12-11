import appIcon from '@/resources/build/icon.png?asset'
import { app, BrowserWindow, Menu, shell } from 'electron'
import * as fs from 'fs/promises'
import * as fsSync from 'node:fs'
import * as path from 'node:path'
import { join } from 'path'
import { showDirectoryPicker } from './dialog'

async function createAppMenu(win: BrowserWindow) {
  const menu = Menu.buildFromTemplate([
    {
      role: 'appMenu',
    },
    {
      label: 'File',
      role: 'fileMenu',
      submenu: [
        {
          label: 'New Packet Window',
        },
        {
          label: 'New Folder',
        },
        {
          label: 'New Request',
        },
        {
          type: 'separator',
        },
        {
          label: 'Open Workspace',
          click: () => {
            openAppWindow(win)
          },
        },
        {
          label: 'Open Default Workspace',
        },
        {
          type: 'separator',
        },
        {
          label: 'Close Window',
          role: 'close',
        },
      ],
    },
  ])
  return menu
}

const lastCwd = () => {
  const userDataPath = app.getPath('userData')
  const filePath = path.join(userDataPath, 'lastCwd')

  const exists = fsSync.existsSync(filePath)
  const lastCwd = exists ? fsSync.readFileSync(filePath, 'utf8') : undefined

  if (!exists || !lastCwd) {
    fs.writeFile(filePath, userDataPath).catch((err) => console.error(err))
    return userDataPath
  } else {
    return lastCwd
  }
}

export async function createAppWindow(cwd: string = lastCwd()) {
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
      additionalArguments: [`--cwd=${cwd}`],
      sandbox: false,
    },
    vibrancy: 'under-window',
  })

  createAppMenu(mainWindow).then((menu) => Menu.setApplicationMenu(menu))

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

export async function openAppWindow(win: BrowserWindow) {
  const dirPath = await showDirectoryPicker(win)
  if (!dirPath) return

  createAppWindow(dirPath)
}
