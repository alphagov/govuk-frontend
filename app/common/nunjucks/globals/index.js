const markdown = require('marked')

/**
 * Nunjucks globals
 */
const getHTMLCode = require('./get-html-code.js')
const getNunjucksCode = require('./get-nunjucks-code.js')

module.exports = {
  getHTMLCode,
  getNunjucksCode,
  markdown
}
