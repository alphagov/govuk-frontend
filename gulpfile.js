'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const runsequence = require('run-sequence')
const taskArguments = require('./tasks/gulp/task-arguments')
const nodemon = require('nodemon')

// Gulp sub-tasks
require('./tasks/gulp/clean.js')
require('./tasks/gulp/lint.js')
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/generate-readme.js')
require('./tasks/gulp/watch.js')
// new tasks
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/asset-version.js')

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
gulp.task('scripts', cb => {
  runsequence('js:compile', cb)
})

// Umbrella styles tasks for preview ----
// Runs js lint and compilation
// --------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// Copy icons task ----------------------
// Copies icons to /public
// --------------------------------------
gulp.task('copy:icons', () => {
  return gulp.src(paths.src + 'icons/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(taskArguments.destination + '/icons/'))
})

// All test combined --------------------
// Runs js, scss and accessibility tests
// --------------------------------------
gulp.task('test', cb => {
  runsequence(
              'scss:lint',
              'scss:compile',
              cb)
})

// Copy assets task for local & heroku --
// Copies files to
// taskArguments.destination (public)
// --------------------------------------
gulp.task('copy-assets', cb => {
  runsequence('styles',
              'scripts',
            cb)
})

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', cb => {
  runsequence('clean',
              'generate:readme',
              'copy-assets',
              'serve',
              cb)
})

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------

gulp.task('serve', ['watch'], () => {
  return nodemon({
    script: 'app/start.js'
  })
})

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:package', cb => {
  runsequence(
              'clean',
              'copy-files',
              'js:compile',
              'generate:readme',
              cb)
})
gulp.task('build:dist', cb => {
  runsequence('clean',
              'copy-assets',
              'copy:icons',
              'generate:readme',
              'update-assets-version',
              cb)
})

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task('default', taskListing)
