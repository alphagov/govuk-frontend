import { npm } from '@govuk-frontend/tasks'
import { series } from 'gulp'

import { scripts, styles } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default function buildDist(options) {
  return series(
    npm.script('clean', [], options),
    scripts(options),
    styles(options)
  )
}
