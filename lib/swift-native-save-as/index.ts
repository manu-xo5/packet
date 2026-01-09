/* eslint-disable @typescript-eslint/no-require-imports */
import { join } from 'node:path'
import { isDev } from '../constants'

const nativePath = isDev
  ? join(process.cwd(), 'lib/swift-native-save-as/build/Release/save-as.node')
  : join(__dirname, '../../lib/swift-native-save-as/build/Release/save-as.node')

const native = require(nativePath)

/**
 * Polls for macOS system events.
 * This is required when running in a standalone Node.js process without an existing event loop on macOS.
 */
export function pollEvents(): void {
  return native.pollEvents()
}

/**
 * Opens a native macOS "Save As" dialog.
 * @returns The selected file path as a string, or null if the user cancelled.
 */
export function showSaveDialog(): string | null {
  return native.showSaveDialog()
}
