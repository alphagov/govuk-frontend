import { join } from 'path'

import { npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'
import slash from 'slash'

import { scripts, styles, templates } from './index.mjs'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.{cjs,js,mjs}` files change
 * - lint and run `gulp templates` when `.{md,njk}` files change
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const watch = (options) => gulp.parallel(
  /**
   * Stylesheets build + lint watcher
   */
  task.name('lint:scss watch', () =>
    gulp.watch([
      `${slash(options.srcPath)}/govuk/**/*.scss`,
      `!${slash(options.srcPath)}/govuk/vendor/*`
    ], gulp.parallel(
      npm.script('lint:scss:cli', [slash(join(options.workspace, '**/*.scss'))]),
      styles(options)
    ))
  ),

  /**
   * JavaScripts build + lint watcher
   */
  task.name('lint:js watch', () =>
    gulp.watch([
      `${slash(options.srcPath)}/govuk/**/*.mjs`
    ], gulp.parallel(
      npm.script('lint:js:cli', [slash(join(options.workspace, '**/*.{cjs,js,mjs}'))]),
      scripts(options)
    ))
  ),

  /**
   * Component template watcher
   */
  task.name('copy:templates watch', () =>
    gulp.watch([
      `${slash(options.srcPath)}/govuk/**/*.{md,njk}`
    ], templates(options))
  )
)
