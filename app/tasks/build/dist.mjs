import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../../config/index.js'
import { files, task } from '../../../tasks/index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  task.name('clean', () =>
    files.clean('**/*', {
      destPath: join(paths.app, 'dist')
    })
  ),

  // Copy GOV.UK Frontend static assets
  task.name('copy:assets', () =>
    files.copy('**/*', {
      srcPath: join(paths.src, 'govuk/assets'),
      destPath: join(paths.app, 'dist/assets')
    })
  ),

  'scripts',
  'styles'
)
