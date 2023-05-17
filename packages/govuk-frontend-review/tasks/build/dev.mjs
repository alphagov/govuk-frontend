import { npm } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { watch } from '../index.mjs'

/**
 * Dev task
 * Runs a sequence of tasks on start
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export default (options) => gulp.parallel(
  npm.script('serve', [], options),
  watch(options)
)
