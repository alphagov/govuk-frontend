import { join, resolve } from 'path'

import { pkg } from '@govuk-frontend/config'
import { configs, scripts, npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * JavaScripts task (for watch)
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) =>
  gulp.series(
    /**
     * Compile GOV.UK Frontend JavaScript for all entry points
     */
    task.name("compile:js 'modules'", () =>
      scripts.compile('**/{all,components/*/!(*.test)}.mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.publish.config.mjs')
      })
    ),

    /**
     * Compile GOV.UK Frontend JavaScript (minified) for main entry point only
     */
    task.name("compile:js 'minified'", () =>
      scripts.compile('**/all.mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.release.config.mjs'),

        // Rename using package name and `*.min.js` extension due to
        // web server ES module `*.mjs` Content-Type header support
        filePath({ dir, name }) {
          return join(dir, `${name.replace(/^all/, pkg.name)}.min.js`)
        }
      })
    ),

    /**
     * Compile GOV.UK Prototype Kit config
     */
    task.name("compile:js 'govuk-prototype-kit'", () =>
      configs.compile('govuk-prototype-kit.config.mjs', {
        srcPath: join(options.srcPath, 'govuk-prototype-kit'),
        destPath: resolve(options.destPath, '../') // Top level (not dist) for compatibility
      })
    ),

    // Compile GOV.UK Frontend build stats
    npm.script('build:stats', [], options)
  )
