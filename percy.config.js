const { executablePath } = require('puppeteer')

/**
 * Percy config
 *
 * @type {import('@percy/config').PercyConfigObject}
 */
module.exports = {
  discovery: {
    concurrency: 1,
    launchOptions: {
      executable: executablePath()
    }
  },
  version: 2
}
