const marked = require('marked')

/**
 * Nunjucks globals
 */
const getHTMLCode = require('./get-html-code.js')
const getNunjucksCode = require('./get-nunjucks-code.js')
const markdown = (content) => marked.parse(content)

module.exports = {
  getHTMLCode,
  getNunjucksCode,
  markdown
}
