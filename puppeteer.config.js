const { join } = require('path')

const { paths } = require('govuk-frontend-config')

/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  cacheDirectory: join(paths.root, '.cache', 'puppeteer')
}
