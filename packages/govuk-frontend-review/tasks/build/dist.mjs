import { npm } from '@govuk-frontend/tasks'
import gulp from 'gulp'

import { styles } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default (options) =>
  gulp.series(npm.script('clean', [], options), styles(options))
