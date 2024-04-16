import { task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Copy GOV.UK Frontend template files (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const templates = (options) =>
  gulp.series(
    task.name('copy:templates', () =>
      gulp
        .src('govuk/**/*.{md,njk}', {
          base: options.srcPath,
          cwd: options.srcPath
        })
        .pipe(gulp.dest(options.destPath))
    )
  )
