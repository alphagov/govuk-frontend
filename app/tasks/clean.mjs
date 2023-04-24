import { join } from 'path'

import { paths } from '../../config/index.js'
import { files } from '../../tasks/index.mjs'

/**
 * Clean task
 */
export async function clean () {
  await files.clean('**/*', {
    destPath: join(paths.app, 'dist')
  })
}
