import { TestEnvironment } from 'jest-environment-jsdom'

/**
 * Virtual browser environment
 * Adds jsdom window/document globals
 */
class BrowserVirtualEnvironment extends TestEnvironment {
  async setup () {
    await super.setup()
  }
}

export default BrowserVirtualEnvironment
