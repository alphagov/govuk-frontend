import { join } from 'path'

import { paths } from 'govuk-frontend-config'

/**
 * Default build paths
 *
 * @type {import('govuk-frontend-tasks').TaskOptions}
 */
export const options = {
  basePath: paths.app,
  srcPath: join(paths.app, 'src'),
  destPath: join(paths.app, 'dist')
}
