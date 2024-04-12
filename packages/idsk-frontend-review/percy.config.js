const { executablePath } = require('puppeteer')

/**
 * Percy config
 *
 * @type {import('@percy/core').PercyConfigOptions}
 */
module.exports = {
  discovery: {
    launchOptions: {
      executable: executablePath()
    }
  },
  version: 2
}
