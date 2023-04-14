import { join } from 'path'

import { files } from 'govuk-frontend-tasks'

import { paths } from '../../config/index.js'

/**
 * Copy GOV.UK Frontend static assets
 */
export async function assets () {
  await files.copy('**/*', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.app, 'dist/assets')
  })
}
