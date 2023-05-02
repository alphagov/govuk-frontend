import { join } from 'path'

import { files, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Copy GOV.UK Frontend template files (for watch)
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const templates = (options) => gulp.series(
  task.name('copy:templates', () =>
    files.copy('**/*.{md,njk}', {
      srcPath: join(options.srcPath, 'govuk'),
      destPath: join(options.destPath, 'govuk')
    })
  )
)
