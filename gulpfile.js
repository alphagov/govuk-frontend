'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const taskArguments = require('./tasks/task-arguments')

// Gulp sub-tasks
require('./tasks/gulp/clean.js')
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/lint.js')
require('./tasks/gulp/watch.js')
// new tasks
require('./tasks/gulp/copy-to-destination.js')

// Node tasks
const buildSassdocs = require('./tasks/sassdoc.js')
const runNodemon = require('./tasks/nodemon.js')
const updateDistAssetsVersion = require('./tasks/asset-version.js')

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
gulp.task('scripts', gulp.series(
  'js:lint',
  'js:compile'
))

// Umbrella styles tasks for preview ----
// Runs scss lint and compilation
// --------------------------------------
gulp.task('styles', gulp.series(
  'scss:lint',
  'scss:compile'
))

// Copy assets task ----------------------
// Copies assets to taskArguments.destination (public)
// --------------------------------------
gulp.task('copy:assets', () => {
  return gulp.src(paths.src + 'assets/**/*')
    .pipe(gulp.dest(taskArguments.destination + '/assets/'))
})

// Copy assets task for local & heroku --
// Copies files to
// taskArguments.destination (public)
// --------------------------------------
gulp.task('copy-assets', gulp.series(
  'styles',
  'scripts'
))

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------
gulp.task('serve', gulp.parallel(
  'watch',
  runNodemon
))

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', gulp.series(
  'clean',
  'copy-assets',
  buildSassdocs,
  'serve'
))

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:package', gulp.series(
  'clean',
  'copy-files',
  'js:compile',
  'js:copy-esm'
))

gulp.task('build:dist', gulp.series(
  'clean',
  'copy-assets',
  'copy:assets',
  updateDistAssetsVersion
))

gulp.task('sassdoc', buildSassdocs)

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task('default', taskListing)
