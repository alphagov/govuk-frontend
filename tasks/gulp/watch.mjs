import gulp from 'gulp'
import slash from 'slash'

import configPaths from '../../config/paths.js'

/**
 * Watch task
 * During development, this task will:
 * - run `gulp styles` when `.scss` files change
 * - run `gulp scripts` when `.mjs` files change
 *
 * @returns {Promise<import('fs').FSWatcher[]>} Array from file system watcher objects
 */
export function watch () {
  return Promise.all([
    gulp.watch([
      'sassdoc.config.yaml',
      `${slash(configPaths.app)}/**/*.scss`,
      `${slash(configPaths.src)}/govuk/**/*.scss`,
      `!${slash(configPaths.src)}/govuk/vendor/*`
    ], gulp.series('styles')),

    gulp.watch([
      'jsdoc.config.js',
      `${slash(configPaths.src)}/govuk/**/*.mjs`
    ], gulp.series('scripts'))
  ])
}

watch.displayName = 'watch'
