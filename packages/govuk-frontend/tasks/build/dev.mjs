import gulp from 'gulp'

import { watch } from '../index.mjs'

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
export default gulp.series(
  watch
)
