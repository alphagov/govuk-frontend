import gulp from 'gulp'
import taskListing from 'gulp-task-listing'

import { updateAssetsVersion } from './tasks/asset-version.mjs'
import { clean } from './tasks/clean.mjs'
import { compileJavaScripts } from './tasks/compile-javascripts.mjs'
import { compileStylesheets } from './tasks/compile-stylesheets.mjs'
import { copyAssets, copyFiles } from './tasks/gulp/copy-to-destination.mjs'
import { watch } from './tasks/gulp/watch.mjs'
import { updatePrototypeKitConfig } from './tasks/prototype-kit-config.mjs'
import { npmScriptTask } from './tasks/run.mjs'

/**
 * Umbrella scripts tasks (for watch)
 * Runs JavaScript code quality checks, documentation, compilation
 */
gulp.task('scripts', gulp.series(
  gulp.parallel(
    npmScriptTask('lint:js'),
    compileJavaScripts
  ),
  npmScriptTask('build:jsdoc')
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  gulp.parallel(
    npmScriptTask('lint:scss'),
    compileStylesheets
  ),
  npmScriptTask('build:sassdoc')
))

/**
 * Build review app task
 * Prepare public folder for review app
 */
gulp.task('build:app', gulp.series(
  clean,
  copyAssets,
  compileJavaScripts,
  compileStylesheets,
  npmScriptTask('build:jsdoc'),
  npmScriptTask('build:sassdoc')
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean,
  copyFiles,
  compileJavaScripts,
  compileStylesheets,
  updatePrototypeKitConfig
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  'build:app',
  updateAssetsVersion
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  'build:app',
  watch,
  npmScriptTask('serve', ['--workspace', 'app'])
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
