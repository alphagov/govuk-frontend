import { join } from 'path'

import { styles, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) =>
  gulp.series(
    task.name('compile:scss', () =>
      styles.compile('**/[!_]*.scss', {
        ...options,

        srcPath: join(options.srcPath, 'stylesheets'),
        destPath: join(options.destPath, 'stylesheets'),
        configPath: join(options.basePath, 'postcss.config.mjs'),

        // Rename with `*.min.css` extension
        filePath({ dir, name }) {
          return join(dir, `${name}.min.css`)
        }
      })
    )
  )
