import { join } from 'path'

import { styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) => gulp.series(
  /**
   * Apply CSS prefixes to GOV.UK Frontend Sass
   */
  task.name('compile:scss', () =>
    styles.compile('**/*.scss', {
      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk')
    })
  ),

  /**
   * Apply CSS prefixes to GOV.UK Prototype Kit Sass
   */
  task.name("compile:scss 'govuk-prototype-kit'", () =>
    styles.compile('init.scss', {
      srcPath: join(options.srcPath, 'govuk-prototype-kit'),
      destPath: join(options.destPath, 'govuk-prototype-kit')
    })
  )
)
