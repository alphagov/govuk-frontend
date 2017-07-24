'use strict'

const gulp = require('gulp')
const paths = require('../../config/paths.json')
const wrap = require('gulp-wrap')
gulp.task('examples', () => {
  gulp.src([paths.src + 'examples/**/*.html'])
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(gulp.dest(paths.preview + 'examples/'))
})
