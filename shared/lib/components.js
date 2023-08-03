const { join } = require('path')

const nunjucks = require('nunjucks')

const { getListing, getDirectories } = require('./files')
const { packageNameToPath, componentNameToMacroName } = require('./names')

// Nunjucks default environment
const env = nunjucksEnv()

/**
 * Nunjucks environment factory
 *
 * @param {string[]} [searchPaths] - Nunjucks search paths (optional)
 * @param {import('nunjucks').ConfigureOptions} [nunjucksOptions] - Nunjucks options (optional)
 * @returns {import('nunjucks').Environment} Nunjucks environment
 */
function nunjucksEnv(searchPaths = [], nunjucksOptions = {}) {
  const packagePath = packageNameToPath('govuk-frontend')

  // Add to Nunjucks search paths
  searchPaths.push(join(packagePath, 'src'))

  // Nunjucks environment
  return nunjucks.configure(searchPaths, {
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag,
    ...nunjucksOptions
  })
}

/**
 * Load single component fixtures
 *
 * @param {string} componentName - Component name
 * @returns {Promise<ComponentFixtures>} Component data
 */
const getComponentFixtures = async (componentName) => {
  return require(join(
    packageNameToPath('govuk-frontend'),
    `dist/govuk/components/${componentName}/fixtures.json`
  ))
}

/**
 * Load all components' data
 *
 * @returns {Promise<(ComponentFixtures)[]>} Components' data
 */
const getComponentsFixtures = async () => {
  const componentNames = await getComponentNames()
  return Promise.all(componentNames.map(getComponentFixtures))
}

/**
 * Get component files
 *
 * @param {string} [componentName] - Component name
 * @returns {Promise<string[]>} Component files
 */
const getComponentFiles = (componentName = '') =>
  getListing(
    join(
      packageNameToPath('govuk-frontend'),
      `dist/govuk/components/${componentName}/**/*`
    )
  )

/**
 * Get component names
 *
 * @returns {Promise<string[]>} Component names
 */
async function getComponentNames() {
  return getDirectories(
    join(packageNameToPath('govuk-frontend'), '**/dist/govuk/components/')
  )
}

/**
 * Get component names, filtered
 *
 * @param {(componentName: string, componentFiles: string[]) => boolean} filter - Component names array filter
 * @returns {Promise<string[]>} Component names
 */
async function getComponentNamesFiltered(filter) {
  const componentNames = await getComponentNames()
  const componentFiles = await getComponentFiles()

  // Apply component names filter
  return componentNames.filter((componentName) =>
    filter(componentName, componentFiles)
  )
}

/**
 * Get examples from component fixtures
 *
 * @param {string} componentName - Component name
 * @returns {Promise<{ [name: string]: ComponentFixture['options'] }>} Component examples as an object
 */
async function getExamples(componentName) {
  const { fixtures } = await getComponentFixtures(componentName)

  /** @type {{ [name: string]: ComponentFixture['options'] }} */
  const examples = {}

  for (const example of fixtures) {
    examples[example.name] = example.options
  }

  return examples
}

/**
 * Render component HTML
 *
 * @param {string} componentName - Component name
 * @param {MacroOptions} [params] - Nunjucks macro options (or params)
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the component
 */
function renderComponent(componentName, params, options) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `govuk/components/${componentName}/macro.njk`

  return renderMacro(macroName, macroPath, params, options)
}

/**
 * Render macro HTML
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro
 * @param {MacroOptions} [params] - Nunjucks macro options (or params)
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the macro
 */
function renderMacro(macroName, macroPath, params = {}, options) {
  const paramsFormatted = JSON.stringify(params, undefined, 2)

  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  macroString += options?.callBlock
    ? `{%- call ${macroName}(${paramsFormatted}) -%}${options.callBlock}{%- endcall -%}`
    : `{{- ${macroName}(${paramsFormatted}) -}}`

  return renderString(macroString)
}

/**
 * Render string
 *
 * @param {string} string - Nunjucks string to render
 * @param {object} [context] - Nunjucks context object (optional)
 * @returns {string} HTML rendered from the Nunjucks string
 */
function renderString(string, context) {
  return env.renderString(string, context)
}

module.exports = {
  getComponentFixtures,
  getComponentsFixtures,
  getComponentFiles,
  getComponentNames,
  getComponentNamesFiltered,
  getExamples,
  nunjucksEnv,
  renderComponent,
  renderMacro,
  renderString
}

/**
 * Component data
 *
 * @typedef {object} ComponentData
 * @property {ComponentOption[]} [params] - Nunjucks macro option (or param) configs
 * @property {ComponentExample[]} [examples] - Component examples with Nunjucks macro options (or params)
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 * @property {string} [accessibilityCriteria] - Accessibility criteria
 */

/**
 * Nunjucks macro option (or param) config
 *
 * @typedef {object} ComponentOption
 * @property {string} name - Option name
 * @property {'array' | 'boolean' | 'integer' | 'nunjucks-block' | 'object' | 'string'} type - Option type
 * @property {boolean} required - Option required
 * @property {string} description - Option description
 * @property {boolean} [isComponent] - Option is another component
 * @property {ComponentOption[]} [params] - Nunjucks macro option (or param) configs
 */

/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @typedef {object} ComponentExample
 * @property {string} name - Example name
 * @property {string} [description] - Example description
 * @property {boolean} [hidden] - Example hidden from review app
 * @property {string[]} [previewLayoutModifiers] - Component preview layout class modifiers
 * @property {MacroOptions} options - Nunjucks macro options (or params)
 */

/**
 * Nunjucks macro options
 *
 * @typedef {{ [param: string]: unknown }} MacroOptions
 */

/**
 * Component fixture
 * (used by the Design System website)
 *
 * @typedef {Required<ComponentExample> & { html: string }} ComponentFixture
 */

/**
 * Nunjucks macro render options
 *
 * @typedef {object} MacroRenderOptions
 * @property {string} [callBlock] - Nunjucks macro `caller()` content (optional)
 */

/**
 * Component fixtures
 * (used by the Design System website)
 *
 * @typedef {object} ComponentFixtures
 * @property {string} component - Component name
 * @property {ComponentFixture[]} fixtures - Component fixtures with Nunjucks macro options (or params)
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 */
