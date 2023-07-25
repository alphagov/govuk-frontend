const { join } = require('path')

/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  experiments: {
    /**
     * Use Chromium (for ARM) where supported to
     * avoid 30-40% increase in total test time
     *
     * {@link https://pptr.dev/contributing#macos-arm-and-custom-executables}
     */
    macArmChromiumEnabled: true
  }
}
