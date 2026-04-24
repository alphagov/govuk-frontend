const { globSync } = require('fs')
const { join, basename } = require('path')

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
 * Get all .scss files within a layer, excluding index, import-only and internal
 *
 * @param {string} layer - The name of the layer to get Sass paths from (eg:
 *   "tools", "settings")
 * @returns {Array<{ partialPath: string, name: string }>} An array of objects
 *   containing the path and shortened name of each Sass file
 */
function getSassPathsFromLayer(layer) {
  return globSync(`**/src/govuk/${layer}/**/*.scss`, {
    cwd: paths.package,
    exclude: [
      '**/_index.scss',
      '**/*.import.scss',
      '**/*.mixin.scss',
      '**/*--internal.scss'
    ]
  }).map((partialPath) => ({
    partialPath,
    name: basename(partialPath)
  }))
}

/**
 * Creates a Sass string for configuring GOV.UK Frontend
 *
 * Generates a piece of Sass code that can be injected before
 * loading the file under test. The code configures GOV.UK Frontend
 * based on how the module will be loaded:
 * - creates variable assignments for use with `@import`
 * - loads the `base` module with `@use` and `with`
 *
 * @example
 * ```js
 *  configureGOVUKFrontend('import', {
 *    '$govuk-global-styles': 'true',
 *    '$govuk-functional-colours': '(text: rebeccapurple)'
 *  })
 *  // Generates a series of variable assignments for import
 *  // $govuk-global-styles: true;
 *  // $govuk-functional-colours: (text: rebeccapurple);
 * ```
 * @example
 * ```js
 *  configureGOVUKFrontend('use', {
 *    '$govuk-global-styles': 'true',
 *    '$govuk-functional-colours': '(text: rebeccapurple)'
 *  })
 *  // Loads base with the correct configuration
 *  // @use "base" with (
 *  //   $govuk-global-styles: true,
 *  //   $govuk-functional-colours: (text: rebeccapurple)
 *  // )
 * ```
 * @param {string} type - How GOV.UK Frontend is loaded
 * @param {Record<string,string>} settings - An object associating the variables to configure with their values
 * @returns {string} The code to inject before loading the file under test
 */
function configureGOVUKFrontend(type, settings) {
  // Whether with `import` or `use` the setting assignment
  // is the same: $<SETTING_NAME>: <SETTING_VALUE>. All that changes
  // is how they're separated...
  const settingsAssignments = Object.entries(settings).map(
    (entry) => `${entry.join(': ')}`
  )

  // ... with `@import` each need to be followed by a `;`
  if (type === 'import') {
    return settingsAssignments.map((assignment) => `${assignment};`).join('\n')
  }

  // while with `@use` they need to each be separated by `,`
  return `@use 'base' with (
    ${settingsAssignments.join(',\n')}
  );`
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

module.exports = {
  compileSassFile,
  compileSassString,
  getSassPathsFromLayer,
  configureGOVUKFrontend,
  htmlWithClassName
}
