import { join } from 'path'

import { pkg, version } from '@govuk-frontend/config'
import { files, npm, scripts, styles, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Build dist task
 * Prepare dist folder for release
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default (options) =>
  gulp.series(
    npm.script('clean:release', [], options),

    // Copy GOV.UK Frontend static assets
    task.name('copy:assets', () =>
      gulp
        .src('govuk/assets/**/*', {
          base: join(options.srcPath, 'govuk'),
          cwd: options.srcPath
        })
        .pipe(gulp.dest(options.destPath))
    ),

    // Compile GOV.UK Frontend JavaScript
    task.name("compile:js 'release'", () =>
      scripts.compile('all.mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.release.config.mjs'),

        // Rename using package name (versioned) and `*.min.js` extension due to
        // web server ES module `*.mjs` Content-Type header support
        filePath({ dir, name }) {
          return join(
            dir,
            `${name.replace(/^all/, pkg.name)}-${version}.min.js`
          )
        }
      })
    ),

    // Compile GOV.UK Frontend Sass
    task.name('compile:scss', () =>
      styles.compile('all.scss', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        configPath: join(options.basePath, 'postcss.config.mjs'),

        // Rename using package name (versioned) and `*.min.css` extension
        filePath({ dir }) {
          return join(dir, `${pkg.name}-${version}.min.css`)
        }
      })
    ),

    // Update GOV.UK Frontend version
    task.name("file:version 'VERSION.txt'", () =>
      files.version('VERSION.txt', options)
    )
  )
