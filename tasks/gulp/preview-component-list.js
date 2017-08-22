'use strict'

const gulp = require('gulp')
const paths = require('../../config/paths.json')
const path = require('path')
const inject = require('gulp-inject')
const naturalSort = require('gulp-natural-sort')
const rename = require('gulp-rename')

// Preview components --------------------
// Inserts links to all components html
// Inserts compiled component css into the head of the page
// ---------------------------------------
const getName = file => {
  let name = path.basename(file.path).slice(0, -path.extname(file.path).length).replace(/^_/g, '').replace('-example', '')
  return name[0].toUpperCase() + name.substring(1)
}

gulp.task('preview:component:list', () => {
  gulp.src(paths.src + 'component-list-template.html')
  .pipe(inject(gulp.src([paths.components + '**/*.html', '!' + paths.components + '_component-example/*.html'])
  .pipe(naturalSort()), {
    starttag: '<!-- inject:componentlinks -->',
    transform: function (filepath, file, i, length) {
      return '<li class="component-link"><a href="components/' + getName(file).toLowerCase() + '/index.html">' + getName(file) + '</a></li>'
    },
    ignorePath: paths.components,
    removeTags: true
  }))
  .pipe(rename({
    basename: 'index'
  }))
  .pipe(gulp.dest(paths.preview))
})
