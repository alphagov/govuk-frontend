import { mkdir, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { basename, dirname, join, parse } from 'path'

import PluginError from 'plugin-error'
import { rollup } from 'rollup'
import { minify } from 'uglify-js'

import configPaths from '../config/paths.js'
import { getListing } from '../lib/file-helper.js'
import { componentPathToModuleName } from '../lib/helper-functions.js'

import { destination, isDist, isPackage } from './task-arguments.mjs'

/**
 * GOV.UK Frontend package
 */
const { pkg } = configPaths

/**
 * Compile JavaScript ESM to CommonJS task
 *
 * @returns {Promise<void>}
 */
export async function compileJavaScripts () {
  const moduleEntries = await getModuleEntries()

  try {
    await Promise.all(moduleEntries.map(compileJavaScript))
  } catch (cause) {
    throw new PluginError('compile:js', cause)
  }
}

compileJavaScripts.displayName = 'compile:js'

/**
 * Compile JavaScript ESM to CommonJS helper
 *
 * @param {ModuleEntry} moduleEntry - Module entry
 */
export async function compileJavaScript ([modulePath, { srcPath, destPath, minify }]) {
  const { dir, name } = parse(modulePath)

  // Adjust file path by destination
  const filePath = join(destPath, dir, isDist
    ? `${pkg.name}-${pkg.version}.min.js`
    : `${name}.js`
  )

  // Create Rollup bundle
  const bundle = await rollup({
    input: join(srcPath, modulePath)
  })

  // Compile JavaScript ESM to CommonJS
  let result = await bundle.generate({
    file: filePath,
    sourcemapFile: filePath,
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
  if (minify) {
    result = minifyJavaScript(modulePath, result)
  }

  // Append source map URL
  result.code += `${EOL}//# sourceMappingURL=${basename(filePath)}.map`

  // Create directories
  await mkdir(dirname(filePath), { recursive: true })

  // Write to bundle
  await Promise.all([
    writeFile(filePath, result.code),
    writeFile(`${filePath}.map`, result.map.toString())
  ])
}

/**
 * Minify JavaScript ESM to CommonJS helper
 *
 * @param {string} modulePath - Relative path to module
 * @param {object} result - Generated bundle
 * @param {string} result.code - Source code
 * @param {import('magic-string').SourceMap} result.map - Source map
 * @returns {import('uglify-js').MinifyOutput} Minifier result
 */
export function minifyJavaScript (modulePath, result) {
  const minified = minify({ [modulePath]: result.code }, {
    ie8: true,
    sourceMap: {
      content: result.map,
      filename: result.map.file,
      includeSources: true
    }
  })

  if (minified.error) {
    throw minified.error
  }

  return minified
}

/**
 * JavaScript modules to compile
 *
 * @returns {Promise<ModuleEntry[]>} Module entries
 */
export async function getModuleEntries () {
  const srcPath = join(configPaths.src, 'govuk')
  const destPath = isPackage ? join(destination, 'govuk') : destination

  // Perform a search and return an array of matching file names
  // but for 'dist' and 'public' we only want compiled 'all.js'
  const modulePaths = await getListing(srcPath, isPackage
    ? '**/!(*.test).mjs'
    : 'all.mjs'
  )

  return modulePaths
    .map((modulePath) => ([modulePath, {
      srcPath,
      destPath,
      minify: isDist
    }]))
}

/**
 * Module entry path with options
 *
 * @typedef {[string, ModuleOptions]} ModuleEntry
 */

/**
 * Module options
 *
 * @typedef {object} ModuleOptions
 * @property {string} srcPath - Input directory
 * @property {string} destPath - Output directory
 * @property {boolean} minify - Minifier enabled
 */
