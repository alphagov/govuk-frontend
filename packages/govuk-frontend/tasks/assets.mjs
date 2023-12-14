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
        .src('govuk/assets/**/*', {
          base: options.srcPath,
          cwd: options.srcPath
        })
        .pipe(gulp.dest(options.destPath))
    )
  )
