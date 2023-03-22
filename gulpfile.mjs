import { join } from 'path'

import gulp from 'gulp'
import taskListing from 'gulp-task-listing'

import { paths } from './config/index.js'
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
  compileJavaScripts('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.public
  }),

  npmScriptTask('build:jsdoc')
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  compileStylesheets('**/[!_]*.scss', {
    srcPath: join(paths.app, 'src'),
    destPath: paths.public
  }),

  npmScriptTask('build:sassdoc')
))

/**
 * Build review app task
 * Prepare public folder for review app
 */
gulp.task('build:app', gulp.series(
  clean,
  copyAssets,
  'scripts',
  'styles'
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean,
  copyFiles,

  // Compile GOV.UK Frontend JavaScript
  compileJavaScripts('**/!(*.test).mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk')
  }),

  // Apply CSS prefixes to GOV.UK Frontend Sass
  compileStylesheets('**/*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk')
  }),

  // Apply CSS prefixes to GOV.UK Prototype Kit Sass
  compileStylesheets('init.scss', {
    srcPath: join(paths.src, 'govuk-prototype-kit'),
    destPath: join(paths.package, 'govuk-prototype-kit')
  }),

  updatePrototypeKitConfig
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  clean,
  copyAssets,

  // Compile GOV.UK Frontend JavaScript
  compileJavaScripts('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist
  }),

  // Compile GOV.UK Frontend Sass
  compileStylesheets('**/[!_]*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist
  }),

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
