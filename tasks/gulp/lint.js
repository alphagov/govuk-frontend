'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const standard = require('gulp-standard')
const sasslint = require('gulp-sass-lint')

// Javascript lint check -----------------
// ---------------------------------------
gulp.task('js:lint', () => {
  return gulp.src([configPaths.govukFrontend + '**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

// Scss lint check -----------------------
// ---------------------------------------
gulp.task('scss:lint', () => {
  return gulp.src(configPaths.govukFrontend + '**/*.scss')
    .pipe(sasslint({
      configFile: configPaths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})
