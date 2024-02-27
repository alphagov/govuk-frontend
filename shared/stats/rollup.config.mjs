import { dirname, join, parse } from 'path'

import { paths } from '@govuk-frontend/config'
import { packageTypeToPath } from '@govuk-frontend/lib/names'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'
import { visualizer } from 'rollup-plugin-visualizer'

import { modulePaths, packageOptions } from './src/index.mjs'

// Locate GOV.UK Frontend
const packagePath = packageTypeToPath('govuk-frontend', packageOptions)

/**
 * Rollup config with stats output
 */
export default defineConfig(
  modulePaths.map(
    (modulePath) =>
      /** @satisfies {import('rollup').RollupOptions} */ ({
        input: packageTypeToPath('govuk-frontend', {
          ...packageOptions,
          modulePath
        }),

        /**
         * Output options
         */
        output: {
          file: join('dist', modulePath),
          format: 'es',
          sourcemap: true,

          /**
           * Output plugins
           */
          plugins: [
            terser({
              format: { comments: false },

              // Include sources content from source maps to inspect
              // GOV.UK Frontend and other dependencies' source code
              sourceMap: {
                includeSources: true
              },

              // Compatibility workarounds
              safari10: true
            })
          ]
        },

        /**
         * Input plugins
         */
        plugins: [
          resolve({ rootDir: paths.stats }),

          // Stats: File size
          visualizer({
            emitFile: true,
            filename: `${parse(modulePath).name}.yaml`,
            projectRoot: dirname(packagePath),
            template: 'list',

            // Skip sourcemaps to use original file sizes
            sourcemap: false
          }),

          // Stats: File size (minified)
          visualizer({
            emitFile: true,
            filename: `${parse(modulePath).name}.min.yaml`,
            projectRoot: dirname(packagePath),
            template: 'list',

            // Use sourcemaps to calculate minified sizes
            sourcemap: true
          }),

          // Stats: Module tree map
          visualizer({
            emitFile: true,
            filename: `${parse(modulePath).name}.html`,
            projectRoot: dirname(packagePath),
            template: 'treemap',

            // Use sourcemaps to calculate minified sizes
            sourcemap: true
          })
        ]
      })
  )
)
