import { browser } from 'govuk-frontend-tasks'
import * as build from 'govuk-frontend-tasks/build/index.mjs'
import gulp from 'gulp'

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
