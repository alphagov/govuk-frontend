import { join } from 'path'

import { task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Copy GOV.UK Frontend assets (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const assets = (options) =>
  gulp.series(
    task.name('copy:assets', () =>
      gulp
        .src(join(options.srcPath, 'govuk/assets/**/*'))
        .pipe(gulp.dest(join(options.destPath, 'govuk/assets')))
    )
  )
