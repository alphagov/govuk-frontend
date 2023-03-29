import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../config/index.js'
import { npm, styles, task } from '../../tasks/index.mjs'

/**
 * Stylesheets task (for watch)
 * Compilation, documentation
 */
export const compile = gulp.series(
  task.name('compile:scss', () =>
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
