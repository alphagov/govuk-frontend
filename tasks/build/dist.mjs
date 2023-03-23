import { join } from 'path'

import gulp from 'gulp'

import { paths, pkg } from '../../config/index.js'
import { files, scripts, styles } from '../index.mjs'

/**
 * Build dist task
 * Prepare dist folder for release
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  files.clean('**/*', {
    destPath: paths.dist
  }),

  // Copy GOV.UK Frontend static assets
  files.copyAssets('*/**', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.dist, 'assets')
  }),

  // Compile GOV.UK Frontend JavaScript
  scripts.compile('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.js`)
    }
  }),

  // Compile GOV.UK Frontend Sass
  styles.compile('**/[!_]*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.css`)
    }
  }),

  // Update GOV.UK Frontend version
  files.version('VERSION.txt', {
    destPath: paths.dist
  })
)
