import gulp from 'gulp'

import { assets, clean, scripts, styles } from '../index.mjs'

/**
 * Build review app task
 * Prepare dist folder for review app
 */
export default gulp.series(
  clean,
  gulp.parallel(
    assets,
    scripts,
    styles
  )
)
