const { join } = require('path')

const { paths, sass: sassConfig } = require('@govuk-frontend/config')
const { compileAsync, compileStringAsync } = require('sass-embedded')

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
async function compileSassFile(path, options = {}) {
  return compileAsync(path, {
    loadPaths: sassPaths,
    ...sassConfig.deprecationOptions,
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
async function compileSassString(source, options = {}) {
  return compileStringAsync(source, {
    loadPaths: sassPaths,
    ...sassConfig.deprecationOptions,
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
function htmlWithClassName($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

/**
 * Creates a copy of a given example with the `rebrand` option set to `true`
 *
 * @param {MacroRenderOptions} example - The example to which the `rebrand` option should be added
 * @returns {MacroRenderOptions} The example with `rebrand` added to the options
 */
function withRebrand(example) {
  const context = typeof example.context === 'object' ? example.context : {}

  return {
    ...example,
    context: {
      ...context,
      rebrand: true
    }
  }
}

module.exports = {
  compileSassFile,
  compileSassString,
  htmlWithClassName,
  withRebrand
}

/**
 * @import {MacroRenderOptions} from '@govuk-frontend/lib/components'
 */
