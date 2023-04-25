import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { files, task } from 'govuk-frontend-tasks'

/**
 * Copy GOV.UK Frontend static assets
 */
export const assets = task.name('assets:app', () =>
  files.copy('**/*', {
    srcPath: join(paths.package, 'src/govuk/assets'),
    destPath: join(paths.app, 'dist/assets')
  })
)
