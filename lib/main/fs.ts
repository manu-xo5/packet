import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { app, ipcMain } from 'electron'

function registerFsIpc() {
  ipcMain.on('fs::getUserDataPath', (e) => {
    e.returnValue = app.getPath('userData')
  })

  ipcMain.handle('fs::writeUserData', async (_, fileName: string, data: any) => {
    try {
      const filePath = path.join(app.getPath('userData'), String(fileName))

      await fs.writeFile(filePath, String(data))
      return {
        ok: true,
      }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  })
}

export { registerFsIpc }
