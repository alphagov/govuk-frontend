'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const stylelint = require('gulp-stylelint')

gulp.task('scss:lint', () => {
  return gulp.src([
    configPaths.app + '**/*.scss',
    configPaths.src + '**/*.scss'
  ])
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
})
