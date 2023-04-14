import { join } from 'path'

import { files } from 'govuk-frontend-tasks'

import { paths } from '../../config/index.js'

/**
 * Clean task
 */
export async function clean () {
  await files.clean('**/*', {
    destPath: join(paths.app, 'dist')
  })
}
