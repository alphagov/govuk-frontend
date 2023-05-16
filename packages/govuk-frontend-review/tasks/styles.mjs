import { join } from 'path'

import { npm, styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 * Compilation, documentation
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) => gulp.series(
  task.name('compile:scss', () =>
    styles.compile('**/[!_]*.scss', {
      srcPath: join(options.srcPath, 'stylesheets'),
      destPath: join(options.destPath, 'stylesheets'),

      filePath (file) {
        return join(file.dir, `${file.name}.min.css`)
      }
    })
  ),

  // Build SassDoc for /docs/sass
  npm.script('build:sassdoc', options)
)
