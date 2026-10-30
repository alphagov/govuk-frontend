import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { slash } from '@govuk-frontend/lib/files'
import { npm, task } from '@govuk-frontend/tasks'
import { parallel, watch as gulpWatch } from 'gulp'

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
 * @type {TaskFunction}
 */
export const watch = (options) => parallel(...getTasks(options))

/**
 * Compute the lists of tasks to be run in parallel
 *
 * @param {TaskOptions} options
 * @returns {GulpTaskFunction[]} The list of tasks to run in parallel
 */
function getTasks(options) {
  const tasks = {
    'lint:scss watch': disabledBy('GOVUK_DS_FRONTEND_NO_LINTING', 'scss', () =>
      gulpWatch(
        '**/*.scss',
        { cwd: options.srcPath },

        // Run Stylelint checks
        npm.script('lint:scss:cli', [
          slash(join(options.workspace, '**/*.scss'))
        ])
      )
    ),
    'compile:scss watch': () =>
      gulpWatch(
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
      gulpWatch(
        '**/*.{cjs,js,mjs}',
        { cwd: options.srcPath, ignored: ['**/*.test.*'] },
        parallel(
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
      gulpWatch(
        'javascripts/**/*.mjs',
        { cwd: options.srcPath },

        // Run JavaScripts compile
        scripts(options)
      )
  }

  return Object.entries(tasks)
    .filter(([taskName, fn]) => !!fn)
    .map(([taskName, fn]) => task.create(taskName, fn))
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

/**
 * @import { TaskFunction as GulpTaskFunction} from 'gulp'
 * @import { TaskOptions, TaskFunction} from '@govuk-frontend/tasks'
 */
