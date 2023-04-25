import { paths } from 'govuk-frontend-config'
import { npm, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'
import slash from 'slash'

import { scripts, styles } from './index.mjs'

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
      `${slash(paths.app)}/src/**/*.scss`
    ], npm.script('lint:scss', paths.app)),

    /**
     * Stylesheets build watcher
     */
    gulp.watch([
      `${slash(paths.root)}/sassdoc.config.yaml`,
      `${slash(paths.app)}/src/**/*.scss`,
      `${slash(paths.package)}/src/govuk/**/*.scss`
    ], styles),

    /**
     * JavaScripts lint watcher
     */
    gulp.watch([
      `${slash(paths.app)}/src/javascripts/**/*.mjs`
    ], npm.script('lint:js', paths.app)),

    /**
     * JavaScripts build watcher
     */
    gulp.watch([
      `${slash(paths.root)}/typedoc.config.js`,
      `${slash(paths.app)}/src/javascripts/**/*.mjs`,
      `${slash(paths.package)}/src/govuk-esm/**/*.mjs`
    ], scripts)
  ])
})
