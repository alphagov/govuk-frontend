import { join } from 'path'

import { pkg } from '@govuk-frontend/config'
import { styles, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) =>
  gulp.series(
    /**
     * Compile GOV.UK Frontend Sass
     */
    task.name('compile:scss', () =>
      styles.compile('all.scss', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'postcss.config.mjs'),

        // Rename using package name and `*.min.css` extension
        filePath({ dir }) {
          return join(dir, `${pkg.name}.min.css`)
        }
      })
    ),

    /**
     * Apply CSS prefixes to GOV.UK Frontend Sass
     */
    task.name('postcss:scss', () =>
      styles.compile('**/*.scss', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'postcss.config.mjs')
      })
    ),

    /**
     * Apply CSS prefixes to GOV.UK Prototype Kit Sass
     */
    task.name("postcss:scss 'govuk-prototype-kit'", () =>
      styles.compile('init.scss', {
        ...options,

        srcPath: join(options.srcPath, 'govuk-prototype-kit'),
        destPath: join(options.destPath, 'govuk-prototype-kit'),
        configPath: join(options.basePath, 'postcss.config.mjs')
      })
    )
  )
