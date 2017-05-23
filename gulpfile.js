'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const sasslint = require('gulp-sass-lint')
const sass = require('gulp-sass')
const runsequence = require('run-sequence')

// Styles build task ---------------------
// Compiles CSS from Sass
// Output both a minified and non-minified version into /public/stylesheets/
// ---------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

gulp.task('scss:lint', () => {
  return gulp.src(paths.src + '**/*.scss')
    .pipe(sasslint({
      configFile: paths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})

gulp.task('scss:compile', () => {
  return gulp.src(paths.globalScss + '**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.distCss))
})

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => {
  gulp.watch([paths.src + '**/**/*.scss'], ['styles'])
})

// Dev task --------------------------
// Compiles assets and sets up watches.
// ---------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'watch', cb)
})
