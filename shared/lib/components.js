const { join } = require('path')

const { getYaml, getListing, getDirectories } = require('./files')
const { packageNameToPath } = require('./names')

/**
 * Load single component data
 *
 * @param {string} componentName - Component name
 * @returns {Promise<ComponentData & { name: string }>} Component data
 */
async function getComponentData (componentName) {
  const yamlPath = join(packageNameToPath('govuk-frontend'), `src/govuk/components/${componentName}/${componentName}.yaml`)

  /** @type {ComponentData} */
  const yamlData = await getYaml(yamlPath)

  return {
    name: componentName,
    ...yamlData
  }
}

/**
 * Load all components' data
 *
 * @returns {Promise<(ComponentData & { name: string })[]>} Components' data
 */
async function getComponentsData () {
  const componentNames = await getComponentNames()
  return Promise.all(componentNames.map(getComponentData))
}

/**
 * Get component files
 *
 * @param {string} [componentName] - Component name
 * @returns {Promise<string[]>} Component files
 */
function getComponentFiles (componentName = '') {
  return getListing(join(packageNameToPath('govuk-frontend'), `src/govuk/components/${componentName}/**/*`))
}

/**
 * Get component names (with optional filter)
 *
 * @param {(componentName: string, componentFiles: string[]) => boolean} [filter] - Component names array filter
 * @returns {Promise<string[]>} Component names
 */
async function getComponentNames (filter) {
  const componentNames = await getDirectories(join(packageNameToPath('govuk-frontend'), '**/src/govuk/components/'))

  if (filter) {
    const componentFiles = await getComponentFiles()

    // Apply component names filter
    return componentNames.filter((componentName) =>
      filter(componentName, componentFiles))
  }

  return componentNames
}

/**
 * Get examples from a component's metadata file
 *
 * @param {string} componentName - Component name
 * @returns {Promise<{ [name: string]: ComponentExample['data'] }>} returns object that includes all examples at once
 */
async function getExamples (componentName) {
  const componentData = await getComponentData(componentName)

  /** @type {{ [name: string]: ComponentExample['data'] }} */
  const examples = {}

  for (const example of componentData?.examples || []) {
    examples[example.name] = example.data
  }

  return examples
}

module.exports = {
  getComponentData,
  getComponentsData,
  getComponentFiles,
  getComponentNames,
  getExamples
}

/**
 * Component data from YAML
 *
 * @typedef {object} ComponentData
 * @property {ComponentOption[]} [params] - Nunjucks macro options
 * @property {ComponentExample[]} [examples] - Example Nunjucks macro options
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 * @property {string} [accessibilityCriteria] - Accessibility criteria
 */

/**
 * Component option from YAML
 *
 * @typedef {object} ComponentOption
 * @property {string} name - Option name
 * @property {string} type - Option type
 * @property {boolean} required - Option required
 * @property {string} description - Option description
 * @property {boolean} [isComponent] - Option is another component
 * @property {ComponentOption[]} [params] - Nested Nunjucks macro options
 */

/**
 * Component example from YAML
 *
 * @typedef {object} ComponentExample
 * @property {string} name - Example name
 * @property {object} data - Example data
 * @property {boolean} [hidden] - Example hidden from review app
 */
