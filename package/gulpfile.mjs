import gulp from 'gulp'

import * as build from './tasks/build/index.mjs'
import { scripts, styles } from './tasks/index.mjs'

/**
 * Build target tasks
 */
gulp.task('build:package', build.package)
gulp.task('build:release', build.release)
gulp.task('dev', build.dev)

/**
 * Utility tasks
 */
gulp.task('scripts', scripts)
gulp.task('styles', styles)
