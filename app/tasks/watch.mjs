import gulp from 'gulp'
import slash from 'slash'

import { paths } from '../../config/index.js'
import { npm } from '../../tasks/index.mjs'

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
      `${slash(paths.src)}/govuk/**/*.scss`,
      `!${slash(paths.src)}/govuk/vendor/*`
    ], gulp.parallel(
      npm.script('lint:scss'),
      styles
    )),

    gulp.watch([
      `${slash(paths.root)}/jsdoc.config.js`,
      `${slash(paths.src)}/govuk/**/*.mjs`
    ], gulp.parallel(
      npm.script('lint:js'),
      scripts
    ))
  ])
}
