import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { npm, scripts, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * JavaScripts task (for watch)
 * Compilation, documentation
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) => gulp.series(
  task.name('compile:js', () =>
    scripts.compile('all.mjs', {
      // TODO: Review app should use `options.srcPath` to
      // import scripts from its own `javascripts` directory
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(options.destPath, 'javascripts'),

      filePath (file) {
        return join(file.dir, `${file.name}.min.js`)
      }
    })
  ),

  // Build JSDoc for /docs/javascript
  npm.script('build:jsdoc')
)
