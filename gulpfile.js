const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const configPaths = require('./config/paths.js')
const taskArguments = require('./tasks/task-arguments')

// Gulp sub-tasks
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/watch.js')

// Node tasks
const { buildSassdocs } = require('./tasks/sassdoc.js')
const { updateDistAssetsVersion } = require('./tasks/asset-version.js')
const { cleanDist, cleanPackage, cleanPublic } = require('./tasks/clean.js')
const { npmScriptTask } = require('./tasks/run.js')

/**
 * Umbrella scripts tasks (for watch)
 * Runs JavaScript code quality checks and compilation
 */
gulp.task('scripts', gulp.series(
  npmScriptTask('lint:js', ['--silent']),
  'js:compile'
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks and compilation
 */
gulp.task('styles', gulp.series(
  npmScriptTask('lint:scss', ['--silent']),
  'scss:compile'
))

/**
 * Copy assets task
 * Copies assets to taskArguments.destination (public)
 */
gulp.task('copy:assets', () => {
  return gulp.src(configPaths.src + 'assets/**/*')
    .pipe(gulp.dest(taskArguments.destination + '/assets/'))
})

/**
 * Compile task for local & heroku
 * Runs JavaScript and Sass compilation, including Sass documentation
 */
gulp.task('compile', gulp.series(
  'js:compile',
  'scss:compile',
  buildSassdocs
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  cleanPublic,
  'compile',
  'watch',
  npmScriptTask('serve', ['--silent'])
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  cleanPackage,
  'copy:files',
  'js:compile'
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  cleanDist,
  'compile',
  'copy:assets',
  updateDistAssetsVersion
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
