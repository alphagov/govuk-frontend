const { executablePath } = require('puppeteer')

/**
 * Percy config
 *
 * @type {import('@percy/config').PercyConfigObject}
 */
module.exports = {
  discovery: {
    launchOptions: {
      executable: executablePath()
    }
  },
  version: 2
}
