import gulp from 'gulp'
import taskListing from 'gulp-task-listing'

import { updateAssetsVersion } from './tasks/asset-version.mjs'
import { clean } from './tasks/clean.mjs'
import { compileJavaScripts } from './tasks/compile-javascripts.mjs'
import { compileStylesheets } from './tasks/gulp/compile-assets.mjs'
import { copyAssets, copyFiles } from './tasks/gulp/copy-to-destination.mjs'
import { watch } from './tasks/gulp/watch.mjs'
import { updatePrototypeKitConfig } from './tasks/prototype-kit-config.mjs'
import { npmScriptTask } from './tasks/run.mjs'

/**
 * Umbrella scripts tasks (for watch)
 * Runs JavaScript code quality checks, documentation, compilation
 */
gulp.task('scripts', gulp.series(
  npmScriptTask('lint:js'),
  compileJavaScripts,
  npmScriptTask('build:jsdoc')
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  npmScriptTask('lint:scss'),
  compileStylesheets,
  npmScriptTask('build:sassdoc')
))

/**
 * Compile task for local & heroku
 * Runs JavaScript and Sass compilation, including documentation
 */
gulp.task('compile', gulp.series(
  clean,
  compileJavaScripts,
  compileStylesheets,
  npmScriptTask('build:jsdoc'),
  npmScriptTask('build:sassdoc')
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  'compile',
  watch,
  npmScriptTask('serve', ['--workspace', 'app'])
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean,
  copyFiles,
  compileJavaScripts,
  updatePrototypeKitConfig
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  'compile',
  copyAssets,
  updateAssetsVersion
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
