import { paths } from 'govuk-frontend-config'
import { npm } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { watch } from '../index.mjs'

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
export default gulp.series(
  watch,
  npm.script('serve', paths.app)
)
