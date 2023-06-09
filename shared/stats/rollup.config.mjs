import { dirname, join, parse, relative } from 'path'

import resolve from '@rollup/plugin-node-resolve'
import { paths } from 'govuk-frontend-config'
import { packageTypeToPath } from 'govuk-frontend-lib/names'
import { defineConfig } from 'rollup'
import { visualizer } from 'rollup-plugin-visualizer'

import { modulePaths, packageOptions } from './src/index.mjs'

// Locate GOV.UK Frontend
const packagePath = packageTypeToPath('govuk-frontend', packageOptions)

/**
 * Rollup config with stats output
 */
export default defineConfig(modulePaths
  .map((modulePath) => /** @satisfies {import('rollup').RollupOptions} */({
    input: relative(paths.stats, packageTypeToPath('govuk-frontend', { ...packageOptions, modulePath })),

    /**
     * Output options
     */
    output: {
      file: join('dist', modulePath),
      format: 'es'
    },

    /**
     * Input plugins
     */
    plugins: [
      resolve({ rootDir: paths.stats }),

      // Stats: File size
      visualizer({
        filename: join('dist', dirname(modulePath), `${parse(modulePath).name}.yaml`),
        projectRoot: dirname(packagePath),
        template: 'list'
      }),

      // Stats: Module tree map
      visualizer({
        filename: join('dist', dirname(modulePath), `${parse(modulePath).name}.html`),
        projectRoot: dirname(packagePath),
        template: 'treemap'
      })
    ]
  }))
)
