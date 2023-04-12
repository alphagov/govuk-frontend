import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { files } from 'govuk-frontend-tasks'

/**
 * Clean task
 */
export async function clean () {
  await files.clean('**/*', {
    destPath: join(paths.app, 'dist')
  })
}
