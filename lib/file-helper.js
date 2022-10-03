const { readFile } = require('fs/promises')
const { readdirSync, readFileSync, statSync } = require('fs')
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
 * @returns {{ examples?: unknown[]; params?: unknown[] }} Component data
 */
const getComponentData = async (componentName) => {
  let componentData = {}

  try {
    const yamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
    componentData = yaml.load(await readFile(yamlPath, 'utf8'), { json: true })
  } catch (error) {
    throw new Error(error)
  }

  return componentData
}

const fullPageExamples = () => {
  return getDirectories(path.resolve(configPaths.fullPageExamples))
    .map(folderName => ({
      name: folderName,
      path: folderName,
      ...fm(readFileSync(path.join(configPaths.fullPageExamples, folderName, 'index.njk'), 'utf8')).attributes
    }))
    .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
}

module.exports = {
  allComponents,
  fullPageExamples,
  getComponentData,
  getDirectories,
  getFiles,
  getListing
}
