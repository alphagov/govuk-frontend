import { task } from '@govuk-frontend/tasks'
import { dest, series, src } from 'gulp'

/**
 * Copy GOV.UK Frontend assets (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const assets = (options) =>
  series(
    task.create('copy:assets', () =>
      src('govuk/assets/**/*', {
        base: options.srcPath,
        cwd: options.srcPath,
        encoding: false
      }).pipe(dest(options.destPath))
    )
  )
