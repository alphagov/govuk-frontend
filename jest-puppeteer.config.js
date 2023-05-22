const devServerOptions = require('./jest-dev-server.config.js')

/**
 * @type {import('jest-environment-puppeteer').JestPuppeteerConfig}
 */
module.exports = {
  browserContext: 'incognito',

  /**
   * Workaround for jest-environment-puppeteer 'uncaughtException'
   * see error handling in 'govuk-frontend-helpers/jest/environment/puppeteer.mjs'
   */
  exitOnPageError: false,

  /**
   * Puppeteer launch options
   */
  launch: {
    args: [
      /**
       * Workaround for 'No usable sandbox! Update your kernel' error
       * see more https://github.com/Googlechrome/puppeteer/issues/290
       */
      '--no-sandbox',
      '--disable-setuid-sandbox',

      /**
       * Prevent empty Chrome startup window
       * Tests use their own `browser.newPage()` instead
       */
      '--no-startup-window'
    ],

    /**
     * Allow headless mode switching using `HEADLESS=false`
     * but default to `new` to skip deprecation warning
     *
     * {@link https://developer.chrome.com/articles/new-headless/}
     */
    headless: process.env.HEADLESS !== 'false'
      ? 'new'
      : false,

    // See launch arg '--no-startup-window'
    waitForInitialPage: false
  },

  /**
   * Development server options
   */
  server: devServerOptions
}
