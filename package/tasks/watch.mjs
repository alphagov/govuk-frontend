import { paths } from 'govuk-frontend-config'
import { npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'
import slash from 'slash'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.mjs` files change
 */
export const watch = task.name('watch:app', async () => {
  await Promise.all([
    /**
     * Stylesheets lint watcher
     */
    gulp.watch([
      `${slash(paths.package)}/src/govuk/**/*.scss`,
      `!${slash(paths.package)}/src/govuk/vendor/*`
    ], npm.script('lint:scss', paths.package)),

    /**
     * JavaScripts lint watcher
     */
    gulp.watch([
      `${slash(paths.package)}/src/govuk/**/*.mjs`
    ], npm.script('lint:js', paths.package))
  ])
})
