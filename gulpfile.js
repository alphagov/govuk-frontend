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
require('./tasks/gulp/examples.js')

// Build packages task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:packages', cb => {
  runsequence('test', 'prepare:files', 'packages:update', cb)
})

// Build dist task ----------------------
// Create temp files, update packages
// --------------------------------------
gulp.task('build:dist', cb => {
  runsequence('dist:prepare', 'dist:docs', cb)
})

// Dev task -----------------------------
// Compiles assets and sets up watches
// --------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'scripts',
              'copy:icons',
              'preview:docs',
              'examples',
              'preview:component:list',
              'serve:preview',
              'watch', cb)
})

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

// Copy icons task for preview ---------
// Copies icons to preview
// --------------------------------------
gulp.task('copy:icons', () => {
  return gulp.src(paths.src + 'globals/icons/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(paths.preview + 'icons/'))
})

// All test combined --------------------
// Runs js, scss and accessibility tests
// --------------------------------------
gulp.task('test', cb => {
  runsequence(
              'js:lint',
              'scss:lint',
              'html:axe',
              'html:tenon',
              cb)
})

// Review task for heroku deployments ---
// Compiles files ready for deployment
// --------------------------------------
gulp.task('review', () => {
  runsequence('styles',
              'scripts',
              'copy:icons',
              'preview:docs',
              'examples',
              'preview:component:list')
})

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task('default', taskListing)
