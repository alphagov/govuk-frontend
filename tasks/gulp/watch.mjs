import gulp from 'gulp'
import slash from 'slash'

import { paths } from '../../config/index.js'
import * as npm from '../npm.mjs'

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
      'sassdoc.config.yaml',
      `${slash(paths.app)}/src/**/*.scss`,
      `${slash(paths.src)}/govuk/**/*.scss`,
      `!${slash(paths.src)}/govuk/vendor/*`
    ], gulp.parallel(
      npm.run('lint:scss'),
      'styles'
    )),

    gulp.watch([
      'jsdoc.config.js',
      `${slash(paths.src)}/govuk/**/*.mjs`
    ], gulp.parallel(
      npm.run('lint:js'),
      'scripts'
    ))
  ])
}

watch.displayName = 'watch'
