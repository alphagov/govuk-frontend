import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../config/index.js'
import { files } from '../index.mjs'

/**
 * Build review app task
 * Prepare public folder for review app
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  files.clean('**/*', {
    destPath: paths.public
  }),

  // Copy GOV.UK Frontend static assets
  files.copyAssets('**/*', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.public, 'assets')
  }),

  'scripts',
  'styles'
)
