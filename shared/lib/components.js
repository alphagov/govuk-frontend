const { join } = require('path')

const nunjucks = require('nunjucks')

const { getListing, getDirectories } = require('./files')
const { packageNameToPath, componentNameToMacroName } = require('./names')

const nunjucksEnv = nunjucks.configure(
  [join(packageNameToPath('govuk-frontend'), 'src')],
  {
    trimBlocks: true,
    lstripBlocks: true
  }
)

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
 * Get component names (with optional filter)
 *
 * @param {(componentName: string, componentFiles: string[]) => boolean} [filter] - Component names array filter
 * @returns {Promise<string[]>} Component names
 */
const getComponentNames = async (filter) => {
  const componentNames = await getDirectories(
    join(packageNameToPath('govuk-frontend'), '**/dist/govuk/components/')
  )

  if (filter) {
    const componentFiles = await getComponentFiles()

    // Apply component names filter
    return componentNames.filter((componentName) =>
      filter(componentName, componentFiles)
    )
  }

  return componentNames
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
 * @param {{ [key: string]: unknown }} options - Nunjucks macro options (or params)
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {string} HTML rendered by the macro
 */
function renderComponent(componentName, options, callBlock) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `govuk/components/${componentName}/macro.njk`

  return renderMacro(macroName, macroPath, options, callBlock)
}

/**
 * Render the string result from calling a macro
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro
 * @param {{ [param: string]: unknown }} options - Nunjucks macro options (or params)
 * @param {string} [callBlock] - Content for an optional callBlock, if necessary for the macro to receive one
 * @returns {string} The result of calling the macro
 */
function renderMacro(macroName, macroPath, options = {}, callBlock) {
  const macroOptions = JSON.stringify(options, undefined, 2)

  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  macroString += callBlock
    ? `{%- call ${macroName}(${macroOptions}) -%}${callBlock}{%- endcall -%}`
    : `{{- ${macroName}(${macroOptions}) -}}`

  return nunjucksEnv.renderString(macroString, {})
}

module.exports = {
  getComponentFixtures,
  getComponentsFixtures,
  getComponentFiles,
  getComponentNames,
  getExamples,
  nunjucksEnv,
  renderComponent,
  renderMacro
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
 * @property {{ [param: string]: unknown }} options - Nunjucks macro options (or params)
 */

/**
 * Component fixture
 * (used by the Design System website)
 *
 * @typedef {Required<ComponentExample> & { html: string }} ComponentFixture
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
