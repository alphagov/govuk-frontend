import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { files, task } from 'govuk-frontend-tasks'

/**
 * Clean task
 */
export const clean = task.name('clean:app', () =>
  files.clean('*', {
    destPath: join(paths.app, 'dist')
  })
)
