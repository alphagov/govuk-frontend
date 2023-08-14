const { readFile } = require('fs/promises')
const { parse, relative, basename } = require('path')

const { glob } = require('glob')
const { paths } = require('govuk-frontend-config')
const yaml = require('js-yaml')
const { minimatch } = require('minimatch')
const slash = require('slash')

/**
 * Directory listing for path
 *
 * @param {string} directoryPath - Minimatch pattern to directory
 * @param {import('glob').GlobOptionsWithFileTypesUnset} [options] - Glob options
 * @returns {Promise<string[]>} File paths
 */
async function getListing(directoryPath, options = {}) {
  const listing = await glob(slash(directoryPath), {
    absolute: true,
    nodir: true,
    realpath: true,
    ...options
  })

  // Use relative paths
  return listing
    .map((entryPath) =>
      relative(options.cwd?.toString() ?? paths.root, entryPath)
    )
    .sort()
}

/**
 * Directory listing (directories only)
 *
 * @param {string} directoryPath - Minimatch pattern to directory
 * @returns {Promise<string[]>} Directory names
 */
async function getDirectories(directoryPath) {
  const listing = await getListing(`${slash(directoryPath)}/*/`, {
    nodir: false
  })

  // Use directory names only
  return listing.map((directoryPath) => basename(directoryPath)).sort()
}

/**
 * Directory listing array filter
 * Returns true for files matching every pattern
 *
 * @param {string[]} patterns - Minimatch patterns
 * @returns {(entryPath: string) => boolean} Returns true for files matching every pattern
 */
const filterPath = (patterns) => (entryPath) => {
  return patterns.every((pattern) => minimatch(entryPath, pattern))
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
  return isMatch(entryPath) ? callback(parse(entryPath)) : entryPath
}

/**
 * Read config from YAML file
 *
 * @param {string} configPath - File path to config
 * @returns {Promise<any>} Config from YAML file
 */
async function getYaml(configPath) {
  return yaml.load(await readFile(configPath, 'utf8'), { json: true })
}

module.exports = {
  filterPath,
  getDirectories,
  getListing,
  getYaml,
  mapPathTo
}
