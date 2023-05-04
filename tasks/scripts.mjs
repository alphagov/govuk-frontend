import { join } from 'path'

import { configs, scripts, task } from 'govuk-frontend-tasks'
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
  task.name('compile:mjs', () =>
    scripts.compile('!(*.test).mjs', {
      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk-esm')
    })
  ),

  /**
   * Compile GOV.UK Frontend JavaScript (AMD modules)
   */
  task.name('compile:js', () =>
    scripts.compile('**/!(*.test).mjs', {
      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk'),

      filePath (file) {
        return join(file.dir, `${file.name}.js`)
      }
    })
  ),

  /**
   * Compile GOV.UK Prototype Kit config
   */
  task.name("compile:js 'govuk-prototype-kit'", () =>
    configs.compile('govuk-prototype-kit.config.mjs', {
      srcPath: join(options.srcPath, 'govuk-prototype-kit'),
      destPath: options.destPath,

      filePath (file) {
        return join(file.dir, `${file.name}.json`)
      }
    })
  )
)
