'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sasslint = require('gulp-sass-lint')

// Scss lint check -----------------------
// ---------------------------------------
gulp.task('scss:lint', () => {
  return gulp.src([
    configPaths.app + '**/*.scss',
    configPaths.src + '**/*.scss'
  ])
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})
