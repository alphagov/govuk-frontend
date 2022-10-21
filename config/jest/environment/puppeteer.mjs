import PuppeteerEnvironment from 'jest-environment-puppeteer'

/**
 * Automation browser environment
 * Adds Puppeteer page/browser globals
 */
class BrowserAutomationEnvironment extends PuppeteerEnvironment {
  async setup () {
    await super.setup()
  }
}

export default BrowserAutomationEnvironment
