import { format, join, parse } from 'path'

import { getListing } from 'govuk-frontend-lib/files'
import PluginError from 'plugin-error'
import { rollup } from 'rollup'
import { loadConfigFile } from 'rollup/dist/loadConfigFile.js'

/**
 * Compile JavaScript task
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} [options] - Asset options for script(s)
 */
export async function compile (pattern, options) {
  const modulePaths = await getListing(options.srcPath, pattern)

  // Increase Node.js max listeners warning threshold to silence
  // Rollup calling `process.on('warning')` once per bundle
  process.setMaxListeners(1 + modulePaths.length)

  try {
    const compileTasks = modulePaths
      .map((modulePath) => compileJavaScript([modulePath, options]))

    await Promise.all(compileTasks)
  } catch (cause) {
    throw new PluginError('shared/tasks/scripts', cause)
  }
}

/**
 * Compile JavaScript helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileJavaScript ([modulePath, { configPath, srcPath, destPath, filePath = format }]) {
  const file = parse(modulePath)

  // Rollup config
  const config = await loadConfigFile(configPath, {
    i: join(srcPath, modulePath)
  })

  // Create Rollup bundle(s)
  for (const options of config.options) {
    const bundle = await rollup({
      ...options,

      // Handle warnings as errors
      onwarn (message) {
        throw message
      }
    })

    // Compile JavaScript to output format
    await Promise.all(options.output.map((output) => {
      file.ext = ['es', 'esm', 'module'].includes(output.format)
        ? '.mjs'
        : '.js'

      // Update basename with new extension
      file.base = `${file.name}${file.ext}`

      return bundle.write({
        ...output,

        // Enable source maps
        sourcemap: true,

        // Write to directory for modules
        dir: output.dir ?? (output.preserveModules
          ? destPath
          : undefined),

        // Write to file when bundling
        file: output.file ?? (!output.preserveModules
          ? join(destPath, filePath(file))
          : undefined)
      })
    }))
  }
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./assets.mjs').AssetOutput} AssetOutput
 */
