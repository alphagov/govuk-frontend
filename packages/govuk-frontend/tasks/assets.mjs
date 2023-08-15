import { join } from 'path'

import { files, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Copy GOV.UK Frontend assets (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const assets = (options) =>
  gulp.series(
    task.name('copy:assets', () =>
      files.copy('**/*', {
        srcPath: join(options.srcPath, 'govuk/assets'),
        destPath: join(options.destPath, 'govuk/assets')
      })
    )
  )
