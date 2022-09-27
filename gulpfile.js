const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const configPaths = require('./config/paths.js')
const taskArguments = require('./tasks/task-arguments')

// Gulp sub-tasks
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/watch.js')

// Node tasks
const buildSassdocs = require('./tasks/sassdoc.js')
const runNodemon = require('./tasks/nodemon.js')
const updateDistAssetsVersion = require('./tasks/asset-version.js')
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
 * Copy assets task for local & heroku
 * Runs JavaScript and Sass compilation
 */
gulp.task('copy-assets', gulp.series(
  'styles',
  'scripts'
))

/**
 * Serve task
 * Restarts Node.js app when there are changes
 * affecting .js, .mjs and .json files
 */
gulp.task('serve', gulp.parallel(
  'watch',
  runNodemon
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  cleanPublic,
  'copy-assets',
  buildSassdocs,
  'serve'
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  cleanPackage,
  'copy-files',
  'js:compile'
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  cleanDist,
  'copy-assets',
  'copy:assets',
  updateDistAssetsVersion
))

/**
 * Compiles Sass documentation
 */
gulp.task('sassdoc', buildSassdocs)

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
