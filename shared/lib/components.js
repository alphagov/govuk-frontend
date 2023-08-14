const { join } = require('path')

const { getListing, getDirectories } = require('./files')
const { packageNameToPath } = require('./names')

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

module.exports = {
  getComponentFixtures,
  getComponentsFixtures,
  getComponentFiles,
  getComponentNames,
  getExamples
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
