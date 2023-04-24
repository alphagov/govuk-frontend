import { join } from 'path'

import { paths } from '../../config/index.js'
import { files } from '../../tasks/index.mjs'

/**
 * Copy GOV.UK Frontend static assets
 */
export async function assets () {
  await files.copy('**/*', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.app, 'dist/assets')
  })
}
