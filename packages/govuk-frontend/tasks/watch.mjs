import { join } from 'path'

import { npm, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'
import slash from 'slash'

import { assets, fixtures, scripts, styles, templates } from './index.mjs'

/**
 * Watch task
 *
 * During development, this task will:
 *
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.{cjs,js,mjs}` files change
 * - lint and run `gulp fixtures` when `.yaml` files change
 * - lint and run `gulp templates` when `.{md,njk}` files change
 * - lint and run `gulp assets` when assets change
 *
 * These tasks build output for `gulp watch` in Review app:
 * {@link file://./../../govuk-frontend-review/tasks/watch.mjs}
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const watch = (options) => gulp.parallel(...getTasks(options))

/**
 * Compute the lists of tasks to be run in parallel
 *
 * Allows some of the tasks to be disabled by environment variables
 *
 * @param {import('@govuk-frontend/tasks').TaskOptions} options
 * @returns {any[]} The list of tasks to run in parallel
 */
function getTasks(options) {
  const tasks = {
    'lint:scss watch': () =>
      gulp.watch(
        '**/*.scss',
        { cwd: options.srcPath },

        // Run Stylelint checks
        npm.script('lint:scss:cli', [
          slash(join(options.workspace, '**/*.scss'))
        ])
      ),
    'compile:scss watch': () =>
      gulp.watch(
        '**/*.scss',
        { cwd: options.srcPath },

        // Run Sass compile
        styles(options)
      ),
    'lint:js watch': () =>
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
      ),
    'compile:js watch': () =>
      gulp.watch(
        '**/*.{cjs,js,mjs}',
        { cwd: options.srcPath, ignored: ['**/*.test.*'] },

        // Run JavaScripts compile
        scripts(options)
      ),
    'compile:fixtures watch': () =>
      gulp.watch(
        'govuk/components/*/*.yaml',
        { cwd: options.srcPath },

        // Run fixtures compile
        fixtures(options)
      ),
    'copy:templates watch': () =>
      gulp.watch(
        'govuk/**/*.{md,njk}',
        { cwd: options.srcPath },

        // Run templates copy
        templates(options)
      ),
    'copy:assets watch': () =>
      gulp.watch(
        'govuk/assets/**',
        { cwd: options.srcPath },

        // Run assets copy
        assets(options)
      )
  }

  return Object.entries(tasks).map(([taskName, fn]) => task.name(taskName, fn))
}
