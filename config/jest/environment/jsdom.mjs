import { TestEnvironment } from 'jest-environment-jsdom'

import { globals } from '../globals.mjs'

/**
 * Virtual browser environment
 * Adds jsdom window/document globals, shared test globals
 */
class BrowserVirtualEnvironment extends TestEnvironment {
  async setup () {
    await super.setup()

    // Access virtual console
    const { virtualConsole } = this.dom

    // Ensure test fails for browser exceptions
    virtualConsole.on('jsdomError', (error) => process.emit('error', error))

    // Add shared test globals
    // componentsData, componentsDirectory, examplesDirectory
    this.global.cache ??= await globals()
  }
}

export default BrowserVirtualEnvironment
