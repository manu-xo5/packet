import { BrowserWindow, dialog, ipcMain } from 'electron'

async function showDirectoryPicker(win: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
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

export { showDirectoryPicker, registerDialogIpc }
