import { readFile } from 'fs/promises'
import { join, parse } from 'path'

import { paths } from '@govuk-frontend/config'
import { getListing } from '@govuk-frontend/lib/files'
import { packageTypeToPath } from '@govuk-frontend/lib/names'
import PluginError from 'plugin-error'
import postcss from 'postcss'
// eslint-disable-next-line import/default
import postcssrc from 'postcss-load-config'
import { compileAsync } from 'sass-embedded'

import { assets } from './index.mjs'

/**
 * Compile Sass to CSS task
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} options - Asset options for stylesheet(s)
 */
export async function compile(pattern, options) {
  const modulePaths = await getListing(pattern, {
    cwd: options.srcPath
  })

  try {
    for (const modulePath of modulePaths) {
      await compileStylesheet([modulePath, options])
    }
  } catch (cause) {
    throw new PluginError(`styles.compile('${pattern}')`, cause, {
      // Hide error properties already formatted by Sass
      showProperties: false
    })
  }
}

/**
 * Compile Sass to CSS helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileStylesheet([
  modulePath,
  { basePath, configPath, srcPath, destPath, filePath }
]) {
  const moduleSrcPath = join(srcPath, modulePath)
  const moduleDestPath = join(
    destPath,
    filePath ? filePath(parse(modulePath)) : modulePath
  )

  let css
  let map

  /**
   * Configure PostCSS
   *
   * @type {import('postcss').ProcessOptions}
   */
  const options = {
    from: moduleSrcPath,
    to: moduleDestPath,

    /**
     * Always generate source maps for either:
     *
     * 1. PostCSS on Sass compiler result
     * 2. PostCSS on Sass sources (Autoprefixer only)
     */
    map: {
      annotation: true,
      inline: false
    }
  }

  // Compile Sass to CSS
  if (moduleDestPath.endsWith('.css')) {
    ;({ css, sourceMap: map } = await compileAsync(moduleSrcPath, {
      alertColor: true,

      // Turn off dependency warnings
      quietDeps: true,
      silenceDeprecations: ['slash-div', 'mixed-decls'],

      // Enable source maps
      sourceMap: true,
      sourceMapIncludeSources: true,

      // Resolve @imports via
      loadPaths: [
        // Remove `govuk/` suffix using `modulePath`
        packageTypeToPath('govuk-frontend', {
          modulePath: '../',
          moduleRoot: basePath
        }),

        // Resolve local packages first
        join(basePath, 'node_modules'),
        join(paths.root, 'node_modules')
      ],

      verbose: true
    }))

    // Pass source maps to PostCSS
    if (typeof options.map === 'object') {
      options.map.prev = map
    }
  }

  if (!css) {
    css = await readFile(moduleSrcPath)
  }

  // Locate PostCSS config
  const config = await postcssrc(options, configPath)

  // Transform with PostCSS
  const result = await postcss(config.plugins).process(css, {
    ...options,
    ...config.options
  })

  // Write to files
  await assets.write(moduleDestPath, result)
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./assets.mjs').AssetOutput} AssetOutput
 */
