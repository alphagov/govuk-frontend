const { join } = require('path')

const { paths } = require('govuk-frontend-config')
const { compileAsync, compileStringAsync, Logger } = require('sass-embedded')

const sassPaths = [
  join(paths.package, 'src/govuk'),
  join(paths.root, 'node_modules')
]

/**
 * Render Sass from file
 *
 * @param {string} path - Path to Sass file
 * @param {import('sass-embedded').Options} [options] - Options to pass to Sass
 * @returns {Promise<import('sass-embedded').CompileResult>} Sass compile result
 */
async function compileSassFile (path, options = {}) {
  return compileAsync(path, {
    loadPaths: sassPaths,
    logger: Logger.silent,
    quietDeps: true,
    ...options
  })
}

/**
 * Render Sass from string
 *
 * @param {string} source - Sass source string
 * @param {import('sass-embedded').Options} [options] - Options to pass to Sass
 * @returns {Promise<import('sass-embedded').CompileResult>} Sass compile result
 */
async function compileSassString (source, options = {}) {
  return compileStringAsync(source, {
    loadPaths: sassPaths,
    logger: Logger.silent,
    quietDeps: true,
    ...options
  })
}

/**
 * Get the raw HTML representation of a component, and remove any other
 * child elements that do not match the component.
 * Relies on B.E.M naming ensuring that child components relating to a component
 * are namespaced.
 *
 * @param {import('cheerio').CheerioAPI} $ - requires an instance of cheerio (jQuery) that includes the
 *   rendered component.
 * @param {string} className - the top level class 'Block' in B.E.M terminology
 * @returns {string} returns HTML
 */
function htmlWithClassName ($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

module.exports = {
  htmlWithClassName,
  compileSassFile,
  compileSassString
}
