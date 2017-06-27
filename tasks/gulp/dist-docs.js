'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const wrap = require('gulp-wrap')
const marked = require('gulp-marked')

// Compile docs in dist -------------
// ----------------------------------
gulp.task('dist:docs', cb => {
  return gulp.src([paths.distComponents + '**/*.md'])
    .pipe(marked({}))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(rename(path => {
      path.basename = 'index'
    }))
    .pipe(replace('.css', '.min.css'))
    .pipe(replace('.js', '.min.js'))
    .pipe(gulp.dest(paths.distComponents))
})
