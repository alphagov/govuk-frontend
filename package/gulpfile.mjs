import gulp from 'gulp'

import * as build from './tasks/build/index.mjs'

/**
 * Build target tasks
 */
gulp.task('build:package', build.package)
gulp.task('build:release', build.release)
