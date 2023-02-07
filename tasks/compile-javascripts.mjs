import { join, parse } from 'path'

import PluginError from 'plugin-error'
import { rollup } from 'rollup'
import { minify } from 'terser'

import { paths, pkg } from '../config/index.js'
import { getListing } from '../lib/file-helper.js'
import { componentPathToModuleName } from '../lib/helper-functions.js'

import { writeAsset } from './compile-assets.mjs'
import { destination, isDist, isPackage } from './task-arguments.mjs'

/**
 * Compile JavaScript ESM to CommonJS task
 *
 * The 'all-in-one' JavaScript bundle (all.mjs)
 * will be minified by default for 'dist' and 'public'
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
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileJavaScript ([modulePath, { srcPath, destPath }]) {
  let { dir, name } = parse(modulePath)

  // Adjust file path by destination
  name = isDist ? `${pkg.name}-${pkg.version}` : name

  // Adjust file path for minification
  const filePath = join(destPath, dir, !isPackage
    ? `${name}.min.js`
    : `${name}.js`)

  // Create Rollup bundle
  const bundle = await rollup({
    input: join(srcPath, modulePath)
  })

  // Compile JavaScript ESM to CommonJS
  let result = await bundle[!isPackage ? 'generate' : 'write']({
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
  if (!isPackage) {
    result = await minifyJavaScript(modulePath, result)

    // Write to files
    return writeAsset(filePath, result)
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
 * JavaScript modules to compile
 *
 * @returns {Promise<AssetEntry[]>} Module entries
 */
export async function getModuleEntries () {
  const srcPath = join(paths.src, 'govuk')
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
      destPath
    }]))
}

/**
 * @typedef {import('./compile-assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./compile-assets.mjs').AssetOutput} AssetOutput
 */
