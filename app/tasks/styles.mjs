import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { npm, styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 * Compilation, documentation
 */
export const compile = gulp.series(
  task.name('styles:app', () =>
    styles.compile('**/[!_]*.scss', {
      srcPath: join(paths.app, 'src/stylesheets'),
      destPath: join(paths.app, 'dist/stylesheets'),

      filePath (file) {
        return join(file.dir, `${file.name}.min.css`)
      }
    })
  ),

  // Build SassDoc for /docs/sass
  npm.script('build:sassdoc')
)
