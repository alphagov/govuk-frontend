import { join } from 'path'

import { npm, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'
import slash from 'slash'

import { assets, fixtures, scripts, styles, templates } from './index.mjs'

/**
 * Watch task
 * During development, this task will:
 * - lint and run `gulp styles` when `.scss` files change
 * - lint and run `gulp scripts` when `.{cjs,js,mjs}` files change
 * - lint and run `gulp fixtures` when `.yaml` files change
 * - lint and run `gulp templates` when `.{md,njk}` files change
 * - lint and run `gulp assets` when assets change
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
        [join(options.srcPath, '**/*.scss')],

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
      gulp.watch([join(options.srcPath, '**/*.scss')], styles(options))
    ),

    /**
     * JavaScripts lint watcher
     */
    task.name('lint:js watch', () =>
      gulp.watch(
        join(options.srcPath, '**/*.{cjs,js,mjs}'),
        { ignored: ['**/*.test.*'] },
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
        join(options.srcPath, '**/*.{cjs,js,mjs}'),
        { ignored: ['**/*.test.*'] },
        scripts(options)
      )
    ),

    /**
     * Component fixtures watcher
     */
    task.name('compile:fixtures watch', () =>
      gulp.watch(
        [join(options.srcPath, 'govuk/components/*/*.yaml')],
        fixtures(options)
      )
    ),

    /**
     * Component template watcher
     */
    task.name('copy:templates watch', () =>
      gulp.watch(
        [join(options.srcPath, 'govuk/**/*.{md,njk}')],
        templates(options)
      )
    ),

    // Copy GOV.UK Frontend static assets
    task.name('copy:assets watch', () =>
      gulp.watch([join(options.srcPath, 'govuk/assets/**')], assets(options))
    )
  )
