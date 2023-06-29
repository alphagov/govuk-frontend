import { join, resolve } from 'path'

import { configs, scripts, npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * JavaScripts task (for watch)
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) => gulp.series(
  /**
   * Compile GOV.UK Frontend JavaScript (ES modules)
   */
  task.name("compile:js 'modules'", () =>
    scripts.compile('**/{all,components/*/!(*.test)}.mjs', {
      ...options,

      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk'),
      configPath: join(options.basePath, 'rollup.esm.config.mjs')
    })
  ),

  /**
   * Compile GOV.UK Frontend JavaScript (UMD bundles)
   */
  task.name("compile:js 'umd'", () =>
    scripts.compile('**/{all,components/*/!(*.test)}.mjs', {
      ...options,

      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk'),
      configPath: join(options.basePath, 'rollup.umd.config.mjs')
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
