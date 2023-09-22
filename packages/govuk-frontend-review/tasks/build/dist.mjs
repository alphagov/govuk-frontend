import { files, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

import { styles } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default (options) =>
  gulp.series(
    task.name('clean', () => files.clean('*', options)),
    styles(options)
  )
