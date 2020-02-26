'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
// const sasslint = require('gulp-sass-lint')
const stylelint = require('gulp-stylelint')

// Scss lint check -----------------------
// ---------------------------------------
gulp.task('scss:lint', () => {
  return gulp.src([
    configPaths.app + '**/*.scss',
    configPaths.src + '**/*.scss'
  ])
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
          syntax: 'scss'
        }
      ]
    }))
    // .pipe(sasslint.format())
    // .pipe(sasslint.failOnError())
})
