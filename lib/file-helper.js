const { readFile } = require('fs/promises')
const { join, parse, ParsedPath, relative } = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const yaml = require('js-yaml')
const fm = require('front-matter')
const minimatch = require('minimatch')

const configPaths = require('../config/paths')

/**
 * Test environment globals
 * Used to cache slow operations
 *
 * See `config/jest/globals.mjs`
 */
const cache = global.cache || {}

/**
 * Directory listing for path
 *
 * @param {string} directoryPath
 * @param {string} [pattern] - Minimatch pattern
 * @param {import('glob').IOptions} [options] - Glob options
 * @returns {Promise<string[]>} File paths
 */
const getListing = async (directoryPath, pattern = '**/*', options = {}) => {
  const listing = await glob(pattern, {
    allowEmpty: true,
    cwd: directoryPath,
    matchBase: true,
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
 * @param {string} directoryPath
 * @returns {Promise<string[]>} File paths
 */
const getDirectories = (directoryPath) => {
  const directories = cache.directories?.get(directoryPath)

  // Retrieve from cache
  if (directories) {
    return directories
  }

  // Read from disk
  return getListing(directoryPath, '*/', { nodir: false })
}

/**
 * Directory listing array filter
 * Returns true for files matching every pattern
 *
 * @param {string[]} patterns - Minimatch patterns
 * @returns {function(string): boolean} Returns true for files matching every pattern
 */
const filterPath = (patterns) => (entryPath) => {
  const isMatch = (pattern) => minimatch(entryPath, pattern, {
    matchBase: true
  })

  // Return true for files matching every pattern
  return patterns.every(isMatch)
}

/**
 * Directory listing array mapper
 * Runs callback for files matching every pattern
 *
 * @param {string[]} patterns - Minimatch patterns
 * @param {mapPathToCallback} callback - Runs on files matching every pattern
 * @returns {function(string): string | string[]} Returns path (or array of paths)
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
  const componentData = cache.componentsData
    ?.find(({ name }) => name === componentName)

  // Retrieve from cache
  if (componentData) {
    return componentData
  }

  // Read from disk
  try {
    const yamlPath = join(configPaths.components, componentName, `${componentName}.yaml`)
    const yamlData = yaml.load(await readFile(yamlPath, 'utf8'), { json: true })

    return {
      name: componentName,
      ...yamlData
    }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Load all components' data
 *
 * @returns {Promise<ComponentData[]>} Components' data
 */
const getComponentsData = async () => {
  if (cache.componentsData) {
    return cache.componentsData
  }

  // Read from disk
  const componentNames = await getDirectories(configPaths.components)
  return Promise.all(componentNames.map(getComponentData))
}

/**
 * Load all full page examples' front matter
 *
 * @returns {Promise<FullPageExample[]>} Full page examples
 */
const getFullPageExamples = async () => {
  const directories = await getDirectories(configPaths.fullPageExamples)

  // Add metadata (front matter) to each example
  const examples = await Promise.all(directories.map(async (exampleName) => {
    const templatePath = join(configPaths.fullPageExamples, exampleName, 'index.njk')
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
  getFullPageExamples,
  getListing,
  mapPathTo
}

/**
 * Directory entry path mapper callback
 *
 * @callback mapPathToCallback
 * @param {ParsedPath} file - Parsed file
 * @returns {string[]} Returns path (or array of paths)
 */

/**
 * Component data from YAML
 *
 * @typedef {object} ComponentData
 * @property {string} name - Component name
 * @property {unknown[]} [params] - Nunjucks macro options
 * @property {unknown[]} [examples] - Example Nunjucks macro options
 * @property {string} [previewLayout] - Nunjucks layout for component preview
 * @property {string} [accessibilityCriteria] - Accessibility criteria
 */

/**
 * Full page example from front matter
 *
 * @typedef {object} FullPageExample
 * @property {string} name - Example name
 * @property {string} [scenario] - Description explaining the example
 * @property {string} [notes] - Additional notes about the example
 */
