import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { npm, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'
import slash from 'slash'

import { scripts, styles } from './index.mjs'

/**
 * Watch task
 *
 * During development, this task will:
 *
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.{cjs,js,mjs}` files change
 *
 * These tasks respond to `gulp watch` output from GOV.UK Frontend:
 * {@link file://./../../govuk-frontend/tasks/watch.mjs}
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
        '**/*.scss',
        { cwd: options.srcPath },

        // Run Stylelint checks
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
        ['**/*.scss', join(paths.package, 'dist/govuk/all.scss')],
        {
          cwd: options.srcPath,

          // Prevent early Sass compile by ignoring delete (unlink) event
          // when GOV.UK Frontend runs the `clean` script before build
          events: ['add', 'change']
        },

        // Run Sass compile
        styles(options)
      )
    ),

    /**
     * JavaScripts lint watcher
     */
    task.name('lint:js watch', () =>
      gulp.watch(
        '**/*.{cjs,js,mjs}',
        { cwd: options.srcPath, ignored: ['**/*.test.*'] },
        gulp.parallel(
          // Run TypeScript compiler
          npm.script('build:types', ['--incremental', '--pretty'], options),

          // Run ESLint checks
          npm.script('lint:js:cli', [
            slash(join(options.workspace, '**/*.{cjs,js,mjs}'))
          ])
        )
      )
    ),

    /**
     * JavaScripts build watcher
     */
    task.name('compile:js watch', () =>
      gulp.watch(
        'javascripts/**/*.mjs',
        { cwd: options.srcPath },

        // Run JavaScripts compile
        scripts(options)
      )
    )
  )
