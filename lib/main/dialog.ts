import { BrowserWindow, dialog, ipcMain } from 'electron'

async function showDirectoryPicker(win: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  })

  if (canceled) return undefined

  return filePaths[0] as string | undefined
}

async function promptDialog(win: BrowserWindow) {
  const result = await dialog.showSaveDialog(win, {
    message: 'Create New Worspace',
    showsTagField: false,
    nameFieldLabel: 'Worspace Name',
    buttonLabel: 'Create',
  })

  return result.filePath
}

async function createDirectoryPicker(win: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['createDirectory', 'openDirectory'],
  })

  if (canceled) return undefined

  return filePaths[0] as string | undefined
}

function registerDialogIpc() {
  ipcMain.handle('dialog::showDirectoryPicker', async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return

    return showDirectoryPicker(win)
  })
}

export { showDirectoryPicker, createDirectoryPicker, promptDialog, registerDialogIpc }
