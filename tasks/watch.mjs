import { npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'
import slash from 'slash'

/**
 * Watch task
 * During development, this task will:
 * - lint when `.scss` files change
 * - lint when `.mjs` files change
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const watch = (options) => gulp.parallel(
  /**
   * Stylesheets lint watcher
   */
  task.name('lint:scss watch', () =>
    gulp.watch([
      `${slash(options.srcPath)}/govuk/**/*.scss`,
      `!${slash(options.srcPath)}/govuk/vendor/*`
    ], npm.script('lint:scss', [], options))
  ),

  /**
   * JavaScripts lint watcher
   */
  task.name('lint:js watch', () =>
    gulp.watch([
      `${slash(options.srcPath)}/govuk/**/*.mjs`
    ], npm.script('lint:js', [], options))
  )
)
