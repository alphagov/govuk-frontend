import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'

/**
 * Write asset helper
 *
 * @param {AssetEntry[0]} filePath - File path to asset
 * @param {AssetOutput} result - Generated or minified bundle
 * @returns {Promise<void>}
 */
export async function write (filePath, result) {
  await mkdir(dirname(filePath), { recursive: true })

  const writeTasks = []

  // Files to write
  /** @type {SourceMap | undefined} */
  const map = result.map ? JSON.parse(result.map.toString()) : undefined
  const code = 'css' in result ? result.css : result.code

  // 1. Write code (example.js)
  writeTasks.push(writeFile(filePath, code))

  // 2. Write source map (example.js.map)
  if (map) {
    writeTasks.push(writeFile(`${filePath}.map`, JSON.stringify(map)))
  }

  await Promise.all(writeTasks)
}

/**
 * Asset entry file path with options
 *
 * @typedef {[string, AssetOptions]} AssetEntry
 */

/**
 * Asset options
 *
 * @typedef {object} AssetOptions
 * @property {string} [srcPath] - Input directory
 * @property {string} [destPath] - Output directory
 * @property {PathFormatter} [filePath] - File path formatter
 * @property {TextFormatter} [fileContents] - File contents formatter
 * @property {string[]} [ignore] - File path patterns to ignore
 */

/**
 * Asset path formatter
 *
 * @callback PathFormatter
 * @param {import('path').ParsedPath} file - Parsed file path
 * @returns {string} Formatted file path
 */

/**
 * Asset contents formatter
 *
 * @callback TextFormatter
 * @param {string} [contents] - Parsed file contents
 * @returns {Promise<string>} Formatted file contents
 */

/**
 * Asset compiled output
 *
 * 1. Rollup generated bundle
 * 2. Terser minified bundle
 * 3. Sass compiler result
 *
 * @typedef {import('rollup').OutputChunk | import('terser').MinifyOutput | import('postcss').Result} AssetOutput
 */

/**
 * Asset source maps
 *
 * {@link https://github.com/source-map/source-map-spec}
 *
 * @typedef {import('@jridgewell/source-map').DecodedSourceMap | import('@jridgewell/source-map').EncodedSourceMap} SourceMap
 */
