import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../config/index.js'
import { files } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  files.clean('**/*', {
    destPath: join(paths.app, 'dist')
  }),

  // Copy GOV.UK Frontend static assets
  files.copy('**/*', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.app, 'dist/assets')
  }),

  'scripts',
  'styles'
)
