import PuppeteerEnvironment from 'jest-environment-puppeteer'

import { globals } from '../globals.mjs'

/**
 * Automation browser environment
 * Adds Puppeteer page/browser globals, shared test globals
 */
class BrowserAutomationEnvironment extends PuppeteerEnvironment {
  async setup () {
    await super.setup()

    // Listen for browser exceptions
    this.global.page.on('pageerror', (error) => {
      this.context.console.error(error)

      // Ensure error appears in in reporter summary
      // as Jest suppresses errors with stack traces
      delete error.stack

      // Ensure test fails
      process.emit('error', error)
    })

    // Add shared test globals
    // componentsData, componentsDirectory, examplesDirectory
    this.global.cache ??= await globals()
  }
}

export default BrowserAutomationEnvironment
