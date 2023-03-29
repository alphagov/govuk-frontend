import gulp from 'gulp'

import * as build from './tasks/build/index.mjs'
import { browser } from './tasks/index.mjs'

/**
 * Build target tasks
 */
gulp.task('build:package', build.package)
gulp.task('build:dist', build.dist)

/**
 * Screenshots task
 * Sends screenshots to Percy for visual regression testing
 */
gulp.task('screenshots', browser.screenshots)
