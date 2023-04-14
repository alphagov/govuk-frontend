import { join } from 'path'

import { npm, scripts, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { paths } from '../../config/index.js'

/**
 * JavaScripts task (for watch)
 * Compilation, documentation
 */
export const compile = gulp.series(
  task.name('compile:js', () =>
    scripts.compile('all.mjs', {
      srcPath: join(paths.src, 'govuk'),
      destPath: join(paths.app, 'dist/javascripts'),

      filePath (file) {
        return join(file.dir, `${file.name}.min.js`)
      }
    })
  ),

  // Build JSDoc for /docs/javascript
  npm.script('build:jsdoc')
)
