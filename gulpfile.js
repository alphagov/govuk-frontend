'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const runsequence = require('run-sequence')

// Gulp sub-tasks
require('./tasks/gulp/lint.js')
require('./tasks/gulp/test.js')
require('./tasks/gulp/watch.js')
require('./tasks/gulp/serve.js')
require('./tasks/gulp/dist-prepare.js')
require('./tasks/gulp/dist-docs.js')
require('./tasks/gulp/packages-update.js')
require('./tasks/gulp/prepare-files.js')
require('./tasks/gulp/demo-build.js')
require('./tasks/gulp/preview-compile.js')
require('./tasks/gulp/preview-component-list.js')
require('./tasks/gulp/preview-docs.js')

// Build packages task --------------
// ready for publishing with Lerna
// ----------------------------------
gulp.task('build:packages', cb => {
  runsequence('test', 'prepare:files', 'packages:update', cb)
})

// Build dist task ---------------------
// tmp files are ready, packages updated
// -------------------------------------
gulp.task('build:dist', cb => {
  runsequence('dist:prepare', 'dist:docs', cb)
})

// Dev task -----------------------------
// Compiles assets and sets up watches.
// --------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'scripts',
              'copy:images',
              'preview:docs',
              'preview:component:list',
              'serve:preview',
              'watch', cb)
})

// Umbrrella scripts tasks for preview --
// --------------------------------------
gulp.task('scripts', cb => {
  runsequence('js:lint', 'js:compile', cb)
})

// Umbrella styles tasks for preview ----
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// Copy images task for preview ---------
// --------------------------------------
gulp.task('copy:images', () => {
  return gulp.src(paths.globalImages + '**/*')
    .pipe(gulp.dest(paths.preview + 'images/'))
})

// All test combined ---------------------
// ---------------------------------------
gulp.task('test', cb => {
  runsequence('html:tenon',
              'js:lint',
              'scss:lint',
              cb)
})

// Review task for heroku deployments ----
// ---------------------------------------
gulp.task('review', () => {
  runsequence('styles',
              'scripts',
              'preview:docs',
              'list:components')
})

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------
gulp.task('default', taskListing)
