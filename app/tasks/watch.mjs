import { paths } from 'govuk-frontend-config'
import { npm } from 'govuk-frontend-tasks'
import gulp from 'gulp'
import slash from 'slash'

import { scripts, styles } from './index.mjs'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.mjs` files change
 *
 * @returns {Promise<import('fs').FSWatcher[]>} Array from file system watcher objects
 */
export function watch () {
  return Promise.all([
    gulp.watch([
      `${slash(paths.root)}/sassdoc.config.yaml`,
      `${slash(paths.app)}/src/**/*.scss`,
      `${slash(paths.package)}/src/govuk/**/*.scss`,
      `!${slash(paths.package)}/src/govuk/vendor/*`
    ], gulp.parallel(
      npm.script('lint:scss'),
      styles
    )),

    gulp.watch([
      `${slash(paths.root)}/typedoc.config.js`,
      `${slash(paths.package)}/src/govuk/**/*.mjs`
    ], gulp.parallel(
      npm.script('lint:js'),
      scripts
    ))
  ])
}
