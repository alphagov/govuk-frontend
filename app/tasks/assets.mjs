import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { files } from 'govuk-frontend-tasks'

/**
 * Copy GOV.UK Frontend static assets
 */
export async function assets () {
  await files.copy('**/*', {
    srcPath: join(paths.package, 'src/govuk/assets'),
    destPath: join(paths.app, 'dist/assets')
  })
}
