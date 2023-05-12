import gulp from 'gulp'

import * as build from './tasks/build/index.mjs'
import { options, targets } from './tasks/build/options.mjs'
import { scripts, styles, templates } from './tasks/index.mjs'

/**
 * Build target tasks
 */
gulp.task('build:package', build.package(targets.package))
gulp.task('build:release', build.release(targets.release))
gulp.task('dev', build.dev(options))

/**
 * Utility tasks
 */
gulp.task('scripts', scripts(options))
gulp.task('styles', styles(options))
gulp.task('templates', templates(options))
