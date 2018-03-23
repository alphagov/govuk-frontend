'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sasslint = require('gulp-sass-lint')

// Scss lint check -----------------------
// ---------------------------------------
gulp.task('scss:lint', () => {
  return gulp.src(configPaths.src + '**/*.scss')
    .pipe(sasslint({
      configFile: configPaths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})
