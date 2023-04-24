import gulp from 'gulp'

import * as build from './tasks/build/index.mjs'
import { scripts, styles } from './tasks/index.mjs'

/**
 * Build target tasks
 */
gulp.task('build', build.dist)
gulp.task('dev', build.dev)

/**
 * Utility tasks
 */
gulp.task('scripts', scripts)
gulp.task('styles', styles)
