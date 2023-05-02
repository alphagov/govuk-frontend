const { readFile } = require('fs/promises')
const { join, parse, relative } = require('path')

const fm = require('front-matter')
const { glob } = require('glob')
const { paths } = require('govuk-frontend-config')
const yaml = require('js-yaml')
const { minimatch } = require('minimatch')

/**
 * Directory listing for path
 *
 * @param {string} directoryPath - Path to directory
 * @param {string} [pattern] - Minimatch pattern
 * @param {import('glob').GlobOptionsWithFileTypesUnset} [options] - Glob options
 * @returns {Promise<string[]>} File paths
 */
const getListing = async (directoryPath, pattern = '**/*', options = {}) => {
  const listing = await glob(pattern, {
    absolute: true,
    cwd: directoryPath,
    nodir: true,
    realpath: true,
    ...options
  })

  return listing
    .map((entryPath) => relative(directoryPath, entryPath))
    .sort()
}

/**
 * Directory listing (directories only)
 *
 * @param {string} directoryPath - Path to directory
 * @returns {Promise<string[]>} File paths
 */
const getDirectories = (directoryPath) => {
  return getListing(directoryPath, '*/', { nodir: false })
}

/**
 * Directory listing array filter
 * Returns true for files matching every pattern
 *
 * @param {string[]} patterns - Minimatch patterns
 * @returns {(entryPath: string) => boolean} Returns true for files matching every pattern
 */
const filterPath = (patterns) => (entryPath) => {
  return patterns.every(
    (pattern) => minimatch(entryPath, pattern)
  )
}

/**
 * Directory listing array mapper
 * Runs callback for files matching every pattern
 *
 * @param {string[]} patterns - Minimatch patterns
 * @param {(file: import('path').ParsedPath) => string | string[]} callback - Runs on files matching every pattern
 * @returns {(entryPath: string) => string | string[]} Returns path (or array of paths)
 */
const mapPathTo = (patterns, callback) => (entryPath) => {
  const isMatch = filterPath(patterns)

  // Run callback on files matching every pattern (or original path)
  return isMatch(entryPath)
    ? callback(parse(entryPath))
    : entryPath
}

/**
 * Load single component data
 *
 * @param {string} componentName - Component name
 * @returns {Promise<ComponentData>} Component data
 */
const getComponentData = async (componentName) => {
  const yamlPath = join(paths.package, 'src/govuk/components', componentName, `${componentName}.yaml`)
  const yamlData = yaml.load(await readFile(yamlPath, 'utf8'), { json: true })

  return {
    name: componentName,
    ...yamlData
  }
}

/**
 * Load all components' data
 *
 * @returns {Promise<ComponentData[]>} Components' data
 */
const getComponentsData = async () => {
  const componentNames = await getDirectories(join(paths.package, 'src/govuk/components'))
  return Promise.all(componentNames.map(getComponentData))
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

/**
 * Load all full page examples' front matter
 *
 * @returns {Promise<FullPageExample[]>} Full page examples
 */
const getFullPageExamples = async () => {
  const directories = await getDirectories(join(paths.app, 'src/views/full-page-examples'))

  // Add metadata (front matter) to each example
  const examples = await Promise.all(directories.map(async (exampleName) => {
    const templatePath = join(paths.app, 'src/views/full-page-examples', exampleName, 'index.njk')

    // @ts-expect-error "This expression is not callable" due to incorrect types
    const { attributes } = fm(await readFile(templatePath, 'utf8'))

    return {
      name: exampleName,
      path: exampleName,
      ...attributes
    }
  }))

  const collator = new Intl.Collator('en', {
    sensitivity: 'base'
  })

  return examples.sort(({ name: a }, { name: b }) =>
    collator.compare(a, b))
}

module.exports = {
  filterPath,
  getComponentData,
  getComponentsData,
  getDirectories,
  getExamples,
  getFullPageExamples,
  getListing,
  mapPathTo
}

/**
 * Component data from YAML
 *
 * @typedef {object} ComponentData
 * @property {string} name - Component name
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

/**
 * Full page example from front matter
 *
 * @typedef {object} FullPageExample
 * @property {string} name - Example name
 * @property {string} [scenario] - Description explaining the example
 * @property {string} [notes] - Additional notes about the example
 */
