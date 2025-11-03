import { TestEnvironment } from 'jest-environment-puppeteer'

/**
 * Automation browser environment
 * Adds Puppeteer page/browser globals, shared test globals
 */
class BrowserAutomationEnvironment extends TestEnvironment {
  async setup() {
    await super.setup()

    // Listen for browser exceptions
    this.global.page.on('pageerror', (error) => {
      this.context.console.error(error)

      if (error instanceof Error) {
        emitUncaughtException(error)
      } else {
        // JavaScript allows to `throw` any kind of value, not just errors.
        // Puppeteer does a good effort of translating what it receives into an
        // `Error` object, but in some situation can only forward a non `Error` value
        // from the browser to our code, so it's up to us to translate it
        // into an Error we can emit as uncaught exception
        // https://github.com/puppeteer/puppeteer/blob/a2eb479ec506947e5912532dc414b37ec2bd7f5e/packages/puppeteer-core/src/cdp/utils.ts#L28
        emitUncaughtException(new Error(`Page threw: \`${error}\``))
      }
    })
  }
}

/**
 * Emits an `uncaughtException` signal for Jest to handle
 *
 * @param {Error} error - The error to emit as `uncaughtException
 */
function emitUncaughtException(error) {
  // Ensure error appears in in reporter summary
  // as Jest suppresses errors with stack traces
  delete error.stack

  // Ensure test fails
  process.emit('uncaughtException', error)
}

export default BrowserAutomationEnvironment
