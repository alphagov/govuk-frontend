'use strict'

const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const runsequence = require('run-sequence')
const nodemon = require('nodemon')

// Gulp sub-tasks
require('./tasks/gulp/clean.js')
require('./tasks/gulp/lint.js')
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/compile-components.js')
require('./tasks/gulp/generate-readme.js')
require('./tasks/gulp/watch.js')
// new tasks
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/asset-version.js')

require('./tasks/gulp/review-app.js')

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
gulp.task('scripts', cb => {
  runsequence('js:lint', 'js:compile', cb)
})

// Umbrella styles tasks for preview ----
// Runs js lint and compilation
// --------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// All test combined --------------------
// Runs js, scss and accessibility tests
// --------------------------------------
gulp.task('test', cb => {
  runsequence(
              'js:lint',
              'scss:lint',
              cb)
})

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', cb => {
  runsequence('clean',
              'generate:readme',
              'review:scss:compile',
              'review:js:compile',
              'serve',
              cb)
})

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------

gulp.task('serve', ['watch'], () => {
  return nodemon({
    script: 'app/app.js'
  })
})

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task('default', taskListing)
