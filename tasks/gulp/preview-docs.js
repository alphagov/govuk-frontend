'use strict'

const gulp = require('gulp')
const paths = require('../../config/paths.json')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')
const marked = require('gulp-marked')
const merge = require('merge-stream')
const fileinclude = require('gulp-file-include')

gulp.task('preview:docs', () => {
  let original = gulp.src(['!' + paths.components + '**/*.html', paths.components + '**/*.html'])
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(gulp.dest(paths.preview + 'components/'))

  let compiled = gulp.src([paths.components + '**/*.md'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(marked({}))
    .pipe(rename(path => {
      path.basename = 'index'
    }))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(gulp.dest(paths.preview + 'components/'))

  return merge(original, compiled)
})
