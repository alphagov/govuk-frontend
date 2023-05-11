import { join, parse } from 'path'

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { pkg } from 'govuk-frontend-config'
import { getListing } from 'govuk-frontend-lib/files'
import { componentPathToModuleName } from 'govuk-frontend-lib/names'
import PluginError from 'plugin-error'
import { rollup } from 'rollup'

import { isDev } from './helpers/task-arguments.mjs'

/**
 * Compile JavaScript task
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} [options] - Asset options
 * @returns {Promise<void>}
 */
export async function compile (pattern, options) {
  const modulePaths = await getListing(options.srcPath, pattern)

  try {
    const compileTasks = modulePaths
      .map((modulePath) => compileJavaScript([modulePath, options]))

    await Promise.all(compileTasks)
  } catch (cause) {
    throw new PluginError('compile:js', cause)
  }
}

/**
 * Compile JavaScript helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileJavaScript ([modulePath, { srcPath, destPath, filePath }]) {
  const moduleSrcPath = join(srcPath, modulePath)
  const moduleDestPath = join(destPath, filePath ? filePath(parse(modulePath)) : modulePath)

  // Rollup plugins
  const plugins = [resolve()]

  if (!isDev) {
    // Add GOV.UK Frontend release version
    plugins.push(replace({
      include: join(srcPath, 'common/govuk-frontend-version.mjs'),
      preventAssignment: true,
      values: { development: pkg.version }
    }))
  }

  // Option 1: Rollup bundle set (multiple files)
  // - Module imports are preserved, not concatenated
  if (moduleDestPath.endsWith('.mjs')) {
    const bundle = await rollup({ input: [moduleSrcPath], plugins })

    // Compile JavaScript to ES modules
    await bundle.write({
      dir: destPath,
      entryFileNames: '[name].mjs',
      format: 'es',
      preserveModules: true,
      sourcemap: true
    })

    return
  }

  // Option 2: Rollup bundle (single file)
  // - Universal Module Definition (UMD) bundle
  const bundle = await rollup({ input: moduleSrcPath, plugins })

  // Compile JavaScript to output format
  await bundle.write({
    file: moduleDestPath,
    sourcemapFile: moduleDestPath,
    sourcemap: true,

    // Universal Module Definition (UMD)
    // for browser + Node.js compatibility
    format: 'umd',

    // Used to set the `window` global for 'iife' and 'umd' bundles
    // Components are given unique names (e.g GOVUKFrontend.Accordion)
    amd: { id: componentPathToModuleName(modulePath) },
    name: componentPathToModuleName(modulePath),

    // Output plugins
    plugins: moduleDestPath.endsWith('.min.js')
      ? [terser({ ecma: 5, safari10: true })]
      : []
  })
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./assets.mjs').AssetOutput} AssetOutput
 */
