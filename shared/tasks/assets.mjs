import { dirname, parse, relative } from 'path'
import { fileURLToPath } from 'url'

import slash from 'slash'

import { files } from './index.mjs'

/**
 * Write asset helper
 *
 * @param {AssetEntry[0]} filePath - File path to asset
 * @param {AssetOutput} result - Generated or minified bundle
 * @returns {Promise<void>}
 */
export async function write (filePath, result) {
  const { base, dir } = parse(filePath)

  const writeTasks = []

  // Files to write
  /** @type {SourceMap | undefined} */
  const map = result.map ? JSON.parse(result.map.toString()) : undefined
  const code = 'css' in result ? result.css : result.code

  // 1. Write code (example.js)
  writeTasks.push(files.write(base, {
    destPath: dir,

    async fileContents () {
      return code
    }
  }))

  // 2. Write source map (example.js.map)
  if (map && 'sources' in map) {
    map.sources = map.sources

      /**
       * Make source file:// paths relative (e.g. for Dart Sass)
       * {@link https://sass-lang.com/documentation/js-api/interfaces/CompileResult#sourceMap}
       */
      .map((path) => slash(path.startsWith('file://')
        ? relative(dirname(filePath), fileURLToPath(path))
        : path
      ))

    writeTasks.push(files.write(`${base}.map`, {
      destPath: dir,

      async fileContents () {
        return JSON.stringify(map)
      }
    }))
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
 * @typedef {AssetPathOptions & AssetFileOptions} AssetOptions
 */

/**
 * Asset path options
 *
 * @typedef {object} AssetPathOptions
 * @property {string} [basePath] - Base directory, for example `package`
 * @property {string} [srcPath] - Input directory, for example `package/src`
 * @property {string} [destPath] - Output directory, for example `package/dist`
 */

/**
 * Asset file options
 *
 * @typedef {object} AssetFileOptions
 * @property {(file: import('path').ParsedPath) => string} [filePath] - File path formatter
 * @property {(contents?: string) => Promise<string>} [fileContents] - File contents formatter
 * @property {string[]} [ignore] - File path patterns to ignore
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
