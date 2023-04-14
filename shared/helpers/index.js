const { files, names } = require('govuk-frontend-lib')

const nunjucks = require('./nunjucks')
const puppeteer = require('./puppeteer')
const tests = require('./tests')

/**
 * Helpers
 */
module.exports = {
  files,
  names,
  nunjucks,
  puppeteer,
  tests
}
