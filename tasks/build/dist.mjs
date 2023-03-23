import { join } from 'path'

import gulp from 'gulp'

import { paths, pkg } from '../../config/index.js'
import { clean } from '../clean.mjs'
import { compileJavaScripts } from '../compile-javascripts.mjs'
import { compileStylesheets } from '../compile-stylesheets.mjs'
import { version } from '../file.mjs'
import { copyAssets } from '../gulp/copy-to-destination.mjs'

/**
 * Build dist task
 * Prepare dist folder for release
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  clean('**/*', {
    destPath: paths.dist
  }),

  // Copy GOV.UK Frontend static assets
  copyAssets('*/**', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.dist, 'assets')
  }),

  // Compile GOV.UK Frontend JavaScript
  compileJavaScripts('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.js`)
    }
  }),

  // Compile GOV.UK Frontend Sass
  compileStylesheets('**/[!_]*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.css`)
    }
  }),

  // Update GOV.UK Frontend version
  version('VERSION.txt', {
    destPath: paths.dist
  })
)
