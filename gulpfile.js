const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const configPaths = require('./config/paths.js')
const { destination } = require('./tasks/task-arguments.js')

// Gulp sub-tasks
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/watch.js')

// Node tasks
const { updateDistAssetsVersion } = require('./tasks/asset-version.js')
const { clean } = require('./tasks/clean.js')
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
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  npmScriptTask('lint:scss', ['--silent']),
  npmScriptTask('build:sassdoc', ['--silent']),
  'scss:compile'
))

/**
 * Copy assets task
 * Copies assets to taskArguments.destination (public)
 */
gulp.task('copy:assets', () => {
  return gulp.src(`${configPaths.src}assets/**/*`)
    .pipe(gulp.dest(`${destination}/assets/`))
})

/**
 * Compile task for local & heroku
 * Runs JavaScript and Sass compilation, including Sass documentation
 */
gulp.task('compile', gulp.series(
  'js:compile',
  'scss:compile',
  npmScriptTask('build:sassdoc', ['--silent'])
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  clean,
  'compile',
  'watch',
  npmScriptTask('serve', ['--silent'])
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean,
  'copy:files',
  'js:compile'
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  clean,
  'compile',
  'copy:assets',
  updateDistAssetsVersion
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
