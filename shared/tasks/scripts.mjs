import { format, join, parse, relative } from 'path'

import { getListing } from '@govuk-frontend/lib/files'
import PluginError from 'plugin-error'
import { rollup } from 'rollup'
import { loadConfigFile } from 'rollup/dist/loadConfigFile.js'

/**
 * Compile JavaScript task
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} options - Asset options for script(s)
 */
export async function compile(pattern, options) {
  const modulePaths = await getListing(pattern, {
    cwd: options.srcPath
  })

  try {
    for (const modulePath of modulePaths) {
      await compileJavaScript([modulePath, options])
    }
  } catch (cause) {
    throw new PluginError(`scripts.compile('${pattern}')`, cause, {
      // Show additional error properties from Babel etc
      showProperties: true
    })
  }
}

/**
 * Compile JavaScript helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileJavaScript([
  modulePath,
  { basePath, configPath, srcPath, destPath, filePath = format }
]) {
  const config = await loadConfigFile(configPath, {
    i: join(srcPath, modulePath)
  })

  // Create Rollup bundle(s)
  for (const options of config.options) {
    const bundle = await rollup({
      ...options,

      // Handle warnings as errors
      onwarn(message) {
        throw message
      }
    })

    // Compile JavaScript to output format
    await Promise.all(
      options.output.map((output) => {
        const file = parse(output.file ?? modulePath)

        // Update filename by format unless already in config
        if (!output.file) {
          switch (output.format) {
            case 'es':
            case 'esm':
            case 'module':
              file.ext = output.compact ? '.min.mjs' : '.mjs'
              break

            default:
              file.ext = output.compact ? '.min.js' : '.js'
          }

          // Update basename with new extension and optional suffix
          file.base = `${file.name}${output.preserveModules ? '' : '.bundle'}${
            file.ext
          }`
        }

        return bundle.write({
          ...output,

          // Write to directory for modules
          dir: output.dir ?? (output.preserveModules ? destPath : undefined),

          // Write to file when bundling
          file: !output.preserveModules
            ? join(destPath, filePath(file))
            : undefined,

          // Output modules relative to base path not input
          preserveModulesRoot: relative(basePath, srcPath),

          // Enable source maps
          sourcemap: true
        })
      })
    )
  }
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./assets.mjs').AssetOutput} AssetOutput
 */
