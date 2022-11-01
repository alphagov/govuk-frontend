const { executablePath } = require('puppeteer')

/** @type {import('@percy/config').PercyConfigObject} */
module.exports = {
  discovery: {
    launchOptions: {
      executable: executablePath()
    }
  },
  percy: {
    deferUploads: true
  },
  version: 2
}
