const { readFile, stat } = require('fs/promises')
const { parse, relative, basename } = require('path')

const { paths } = require('@govuk-frontend/config')
const { filesize } = require('filesize')
const { glob } = require('glob')
const yaml = require('js-yaml')
const { minimatch } = require('minimatch')
const slash = require('slash')

/**
 * Check path exists
 *
 * @param {string} entryPath - File or directory path
 * @returns {Promise<boolean>} Returns true for paths that exist
 */
async function hasPath(entryPath) {
  try {
    await stat(entryPath)
    return true
  } catch {
    return false
  }
}

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
 * Get file size entries
 *
 * @param {string} directoryPath - Minimatch pattern to directory
 * @param {import('glob').GlobOptionsWithFileTypesUnset} [options] - Glob options
 * @returns {Promise<FileSize[]>} - File entries with name and size
 */
async function getFileSizes(directoryPath, options = {}) {
  const filesForAnalysis = await getListing(directoryPath, options)
  return Promise.all(filesForAnalysis.map(getFileSize))
}

/**
 * Get file size entry
 *
 * @param {string} filePath - File path
 * @returns {Promise<FileSize>} - File entry with name and size
 */
async function getFileSize(filePath) {
  const { size } = await stat(filePath)
  return {
    path: filePath,
    size
  }
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

/**
 * Compare arrays of FileSize types from the base and the head branch and add a
 * percentage difference to the object.
 *
 * If there's no percentage difference, return a blank row.
 *
 * If a file is present in head or base but not the other, mark it as a new file
 * or a deletion.
 *
 * @param {(FileSize & {size: number})[]} headFiles
 * @param {(FileSize & {size: number})[]} baseFiles
 * @returns {(FileSizeWithPercentage|null)[]} FileSize array with a percentage attribute, potentially reduced, or an empty array
 */
function getFileSizeComparison(headFiles, baseFiles) {
  // Get initial percentage differences and check for deletions
  const comparedFileSizes = baseFiles.map((file) => {
    const headFile = findFileSizeRow(headFiles, file)
    let percentage

    if (!headFile) {
      percentage = 'Deleted'
    } else {
      const sizeDiff = ((headFile.size - file.size) / file.size) * 100

      // Remove '.0' here rather than check for it in the proceeding if to strip
      // out instances of '4.0%'
      percentage = sizeDiff.toFixed(1).replace('.0', '')

      // Return null if there's no percentage difference
      if (percentage === '0%') {
        return null
      }
    }

    return {
      ...file,
      percentage
    }
  })

  // Look for additions
  headFiles.forEach((file) => {
    if (!findFileSizeRow(baseFiles, file)) {
      comparedFileSizes.push({
        ...file,
        percentage: 'New file'
      })
    }
  })

  // remove null rows before returning
  return comparedFileSizes.filter((file) => file)
}

/**
 * Private function used by getFileSizeComparison to find the same FileSize
 * between two arrays of FileSizes.
 *
 * @param {(FileSize & {size: number})[]} fileSizes
 * @param {(FileSize & {size: number})} searchFileSize
 * @returns {(FileSize & {size: number})|undefined} The located FileSize in the compare array, or undefined if not present
 */
function findFileSizeRow(fileSizes, searchFileSize) {
  return fileSizes.find((fileSize) => {
    if (fileSize.type) {
      return (
        fileSize.path === searchFileSize.path &&
        fileSize.type === searchFileSize.type
      )
    }

    return fileSize.path === searchFileSize.path
  })
}

/**
 * Convert the number values of the size param on FileSize types to readable file
 * size strings with filesize.
 *
 * @param {(FileSize|FileSizeWithPercentage)[]} filesizeData
 * @returns {(FileSize|FileSizeWithPercentage)[]} FileSize array with readable file size strings on size attributes
 */
function getReadableFileSizes(filesizeData) {
  return filesizeData.map((file) => ({
    ...file,
    size: `${filesize(file.size, { base: 2 })}`
  }))
}

module.exports = {
  filterPath,
  hasPath,
  getDirectories,
  getFileSizes,
  getFileSize,
  getFileSizeComparison,
  getListing,
  getReadableFileSizes,
  getYaml,
  mapPathTo
}

/**
 * @typedef {object} FileSize
 * @property {string} path - File path
 * @property {number|string} size - File size, as a raw number or human-readable string
 * @property {('bundled'|'minified')} [type] - Type of file size. Only used by module sizes
 * @typedef {FileSize & {percentage: string}} FileSizeWithPercentage - The FileSize type with an extra attribute representing increase or decrease in percentage
 */
