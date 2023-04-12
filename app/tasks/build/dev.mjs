import { paths } from 'govuk-frontend-config'
import { npm } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { watch } from '../index.mjs'

import dist from './dist.mjs'

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
export default gulp.series(
  dist,
  watch,
  npm.script('serve', paths.app)
)
