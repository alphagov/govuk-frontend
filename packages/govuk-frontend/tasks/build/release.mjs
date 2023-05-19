import { join } from 'path'

import { pkg } from 'govuk-frontend-config'
import { files, scripts, styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Build dist task
 * Prepare dist folder for release
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export default (options) => gulp.series(
  task.name('clean', () =>
    files.clean('*', options)
  ),

  // Copy GOV.UK Frontend static assets
  task.name('copy:assets', () =>
    files.copy('*/**', {
      srcPath: join(options.srcPath, 'govuk/assets'),
      destPath: join(options.destPath, 'assets')
    })
  ),

  // Compile GOV.UK Frontend JavaScript
  task.name('compile:js', () =>
    scripts.compile('all.mjs', {
      ...options,

      srcPath: join(options.srcPath, 'govuk'),

      // Rename using package name (versioned) and `*.min.js` extension
      filePath ({ dir, name }) {
        return join(dir, `${name.replace(/^all/, pkg.name)}-${pkg.version}.min.js`)
      }
    })
  ),

  // Compile GOV.UK Frontend Sass
  task.name('compile:scss', () =>
    styles.compile('**/[!_]*.scss', {
      ...options,

      srcPath: join(options.srcPath, 'govuk'),

      // Rename using package name (versioned) and `*.min.css` extension
      filePath ({ dir, name }) {
        return join(dir, `${name.replace(/^all/, pkg.name)}-${pkg.version}.min.css`)
      }
    })
  ),

  // Update GOV.UK Frontend version
  task.name("file:version 'VERSION.txt'", () =>
    files.version('VERSION.txt', options)
  )
)
