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
export const watch = (options) => gulp.parallel(...getTasks(options))

/**
 * Compute the lists of tasks to be run in parallel
 *
 * @param {import('@govuk-frontend/tasks').TaskOptions} options
 * @returns {any[]} The list of tasks to run in parallel
 */
function getTasks(options) {
  const tasks = {
    'lint:scss watch': disabledBy('GOVUK_DS_FRONTEND_NO_LINTING', 'scss', () =>
      gulp.watch(
        '**/*.scss',
        { cwd: options.srcPath },

        // Run Stylelint checks
        npm.script('lint:scss:cli', [
          slash(join(options.workspace, '**/*.scss'))
        ])
      )
    ),
    'compile:scss watch': () =>
      gulp.watch(
        ['**/*.scss', join(paths.package, 'dist/govuk/index.scss')],
        {
          awaitWriteFinish: true,
          cwd: options.srcPath,

          // Prevent early Sass compile by ignoring delete (unlink) event
          // when GOV.UK Frontend runs the `clean` script before build
          events: ['add', 'change']
        },

        // Run Sass compile
        styles(options)
      ),
    'lint:js watch': disabledBy('GOVUK_DS_FRONTEND_NO_LINTING', 'js', () =>
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
    'compile:js watch': () =>
      gulp.watch(
        'javascripts/**/*.mjs',
        { cwd: options.srcPath },

        // Run JavaScripts compile
        scripts(options)
      )
  }

  return Object.entries(tasks)
    .filter(([taskName, fn]) => !!fn)
    .map(([taskName, fn]) => task.name(taskName, fn))
}

function disabledBy(envVariableName, value, fn) {
  // Split by comma to ensure we'll match full options
  // avoiding `css` to match `scss` if we were looking in the whole string
  const disabledValues = process.env[envVariableName]?.split?.(',')

  if (disabledValues?.includes?.(value)) {
    return null
  }

  return fn
}
