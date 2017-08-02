'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const filter = require('gulp-filter')
const wrap = require('gulp-wrap')
const eol = require('gulp-eol')

// Copy files to demo -------------------
// create minified verisons as well
// --------------------------------------
gulp.task('build:demo', () => {
  let pkg = require('../../' + paths.packages + 'all/package.json')
  let assets = filter([paths.dist + '**/*.css', paths.dist + '**/*.js'], {restore: true})
  let copy = gulp.src([
    paths.dist + '/**/*',
    '!' + paths.dist + 'components/**/*.scss',
    '!' + paths.dist + 'components/**/*.md',
    '!' + paths.dist + 'components/**/*.html',
    '!' + paths.dist + 'components/**/*.js',
    '!' + paths.dist + 'examples/**/*',
    '!' + paths.dist + 'icons/**/*'
  ])
  .pipe(replace('.min.css', pkg.version + '.min.css'))
  .pipe(replace('.min.js', pkg.version + '.min.js'))
  .pipe(assets)
  .pipe(rename(obj => {
    obj.basename = obj.basename.replace(/.min$/, '')
    return obj
  }))
  .pipe(rename({
    suffix: pkg.version + '.min'
  }))
  .pipe(assets.restore)
  .pipe(gulp.dest(paths.demo))

  let copyIndex = gulp.src([
    paths.dist + 'components/**/index.html'
  ])
  .pipe(replace(/(govuk.*)(?=\.min)/g, '$1' + pkg.version))
  .pipe(eol())
  .pipe(gulp.dest(paths.demo + 'components/'))

  let copyExamples = gulp.src([
    paths.dist + 'examples/**/*'
  ])
  .pipe(replace(/(govuk.*)(?=\.min)/g, '$1' + pkg.version))
  .pipe(eol())
  .pipe(gulp.dest(paths.demo + 'examples/'))

  let original = gulp.src([paths.dist + 'components/**/*.html', '!' + paths.dist + '/components/**/index.html'])
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(replace(/(govuk.*)(?=\.(js|css))/g, '$1' + pkg.version + '.min'))
    .pipe(eol())
    .pipe(gulp.dest(paths.demo + 'components/'))

  let copyIcons = gulp.src(paths.dist + 'icons/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(paths.demo + 'icons/'))

  return merge(copy, copyIndex, original, copyIcons, copyExamples)
})
