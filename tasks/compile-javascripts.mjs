import { join, parse } from 'path'

import PluginError from 'plugin-error'
import { rollup } from 'rollup'
import { minify } from 'terser'

import { pkg } from '../config/index.js'
import { getListing } from '../lib/file-helper.js'
import { componentPathToModuleName } from '../lib/helper-functions.js'

import { writeAsset } from './compile-assets.mjs'
import { isDist, isPackage, isPublic } from './task-arguments.mjs'

/**
 * Compile JavaScript ESM to CommonJS task
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} [options] - Asset options
 * @returns {() => Promise<void>} Prepared compile task
 */
export function compileJavaScripts (pattern, options) {
  const task = async () => {
    const modulePaths = await getListing(options.srcPath, pattern)

    try {
      const compileTasks = modulePaths
        .map((modulePath) => compileJavaScript([modulePath, options]))

      await Promise.all(compileTasks)
    } catch (cause) {
      throw new PluginError('compile:js', cause)
    }
  }

  task.displayName = 'compile:js'

  return task
}

/**
 * Compile JavaScript ESM to CommonJS helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileJavaScript ([modulePath, { srcPath, destPath }]) {
  const moduleDestPath = join(destPath, getPathByDestination(modulePath))

  // Create Rollup bundle
  const bundle = await rollup({
    input: join(srcPath, modulePath)
  })

  // Compile JavaScript ESM to CommonJS
  const bundled = await bundle[!isPackage ? 'generate' : 'write']({
    file: moduleDestPath,
    sourcemapFile: moduleDestPath,
    sourcemap: true,

    // Universal Module Definition (UMD)
    // for browser + Node.js compatibility
    format: 'umd',

    // Legacy mode is required for IE8 support
    legacy: true,

    // Used to set the `window` global for 'iife' and 'umd' bundles
    // Components are given unique names (e.g GOVUKFrontend.Accordion)
    amd: { id: componentPathToModuleName(modulePath) },
    name: componentPathToModuleName(modulePath)
  })

  // Minify bundle
  if (!isPackage) {
    const minified = await minifyJavaScript(modulePath, bundled)

    // Write to files
    return writeAsset(moduleDestPath, minified)
  }
}

/**
 * Minify JavaScript ESM to CommonJS helper
 *
 * @param {string} modulePath - Relative path to module
 * @param {import('rollup').OutputChunk} result - Generated bundle
 * @returns {Promise<import('terser').MinifyOutput>} Minifier result
 */
export function minifyJavaScript (modulePath, result) {
  const minified = minify({ [modulePath]: result.code }, {
    format: { comments: false },

    // Include source maps
    sourceMap: {
      content: result.map,
      filename: result.map.file,
      url: `${result.map.file}.map`,
      includeSources: true
    },

    // Compatibility workarounds
    ecma: 5,
    ie8: true,
    safari10: true
  })

  return minified
}

/**
 * JavaScript module name by destination
 *
 * @param {AssetEntry[0]} filePath - File path
 * @returns {AssetEntry[0]} File path adjusted by destination
 */
export function getPathByDestination (filePath) {
  let { dir, name } = parse(filePath)

  // Adjust file path by destination
  dir = isPublic ? 'javascripts' : dir
  name = isDist ? `${name.replace(/^all/, pkg.name)}-${pkg.version}` : name

  // Adjust file path for minification
  return join(dir, !isPackage
    ? `${name}.min.js`
    : `${name}.js`)
}

/**
 * @typedef {import('./compile-assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./compile-assets.mjs').AssetOutput} AssetOutput
 */
