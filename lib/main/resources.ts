import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

function getResourcePath(filePath: string) {
  const _filePath = join(__dirname, '../../resources', filePath)
  return pathToFileURL(_filePath).toString()
}

export { getResourcePath }
