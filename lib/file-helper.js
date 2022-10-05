const { readFile } = require('fs/promises')
const { readdirSync, statSync } = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const fm = require('front-matter')

const configPaths = require('../config/paths.js')

/**
 * Directory listing for path
 *
 * @param {string} directoryPath
 * @returns {{ basename: string; stats: import('fs').Stats }[]} entries
 */
const getListing = (directoryPath) => {
  const listing = readdirSync(directoryPath)

  // Loop through listing entries
  return listing.map(basename => ({
    basename, stats: statSync(path.join(directoryPath, basename))
  }))
}

/**
 * Directory listing (directories only)
 *
 * @param {string} directoryPath
 * @returns {string[]} directories
 */
const getDirectories = (directoryPath) => {
  const entries = getListing(directoryPath)

  return entries
    .filter(({ stats }) => stats.isDirectory())
    .map(({ basename: directory }) => directory)
}

/**
 * Directory listing (files only)
 *
 * @param {string} directoryPath
 * @returns {string[]} directories
 */
const getFiles = (directoryPath) => {
  const entries = getListing(directoryPath)

  return entries
    .filter(({ stats }) => stats.isFile())
    .map(({ basename: file }) => file)
}

// Generate component list from source directory, excluding anything that's not
// a directory (for example, .DS_Store files)
const allComponents = getDirectories(configPaths.components)

/**
 * Load single component data
 *
 * @param {string} componentName - Component name
 * @returns {Promise<ComponentData>} Component data
 */
const getComponentData = async (componentName) => {
  try {
    const yamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
    const componentData = yaml.load(await readFile(yamlPath, 'utf8'), { json: true })

    return {
      name: componentName,
      ...componentData
    }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Load all full page examples' front matter
 *
 * @returns {Promise<{ name: string; scenario?: string; notes?: string }[]>} Full page examples
 */
const getFullPageExamples = async () => {
  const directories = await getDirectories(configPaths.fullPageExamples)

  // Add metadata (front matter) to each example
  const examples = await Promise.all(directories.map(async (exampleName) => {
    const templatePath = path.join(configPaths.fullPageExamples, exampleName, 'index.njk')
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
  allComponents,
  getComponentData,
  getDirectories,
  getFiles,
  getFullPageExamples,
  getListing
}

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
