import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { npm, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'
import slash from 'slash'

import { scripts, styles } from './index.mjs'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.mjs` files change
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const watch = (options) =>
  gulp.parallel(
    /**
     * Stylesheets lint watcher
     */
    task.name('lint:scss watch', () =>
      gulp.watch(
        [`${slash(paths.app)}/src/**/*.scss`],
        npm.script('lint:scss:cli', [
          slash(join(options.workspace, '**/*.scss'))
        ])
      )
    ),

    /**
     * Stylesheets build watcher
     */
    task.name('compile:scss watch', () =>
      gulp.watch(
        [
          `${slash(paths.app)}/sassdoc.config.yaml`,
          `${slash(paths.app)}/src/**/*.scss`,
          `${slash(paths.package)}/dist/govuk/**/*.scss`
        ],
        styles(options)
      )
    ),

    /**
     * JavaScripts build watcher
     */
    task.name('compile:js watch', () =>
      gulp.watch(
        [
          `${slash(paths.app)}/typedoc.config.js`,
          `${slash(paths.package)}/dist/govuk/**/*.mjs`
        ],
        scripts(options)
      )
    )
  )