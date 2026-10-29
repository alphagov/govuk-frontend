import { task } from '@govuk-frontend/tasks'
import { dest, series, src } from 'gulp'

/**
 * Copy GOV.UK Frontend template files (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const templates = (options) =>
  series(
    task.name('copy:templates', () =>
      src('govuk/**/*.{md,njk}', {
        base: options.srcPath,
        cwd: options.srcPath
      }).pipe(dest(options.destPath))
    )
  )
