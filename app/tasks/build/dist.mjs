import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { files, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { scripts, styles } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 */
export default gulp.series(
  task.name('clean', () =>
    files.clean('**/*', {
      destPath: join(paths.app, 'dist')
    })
  ),

  gulp.parallel(
    scripts,
    styles
  )
)
