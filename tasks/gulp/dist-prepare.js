'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const postcssnormalize = require('postcss-normalize')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const inject = require('gulp-inject')
const naturalSort = require('gulp-natural-sort')
const replace = require('gulp-replace')
const path = require('path')
const eol = require('gulp-eol')

const getName = file => {
  let name = path.basename(file.path).slice(0, -path.extname(file.path).length).replace(/^_/g, '')
  return name[0].toUpperCase() + name.substring(1)
}

// Copy files to dist ---------------
// Create minified versions as well
// ----------------------------------
gulp.task('dist:prepare', () => {
  let pkg = require('../../' + paths.packages + 'all/package.json')
  let fs = require('fs')
  fs.writeFileSync(paths.dist + 'VERSION.txt', pkg.version + '\r\n')

  let copy = gulp.src([
    paths.tmp + '**/*',
    '!' + paths.tmp + 'component-list-template.html',
    '!' + paths.tmp + 'component-view-template.html',
    '!' + paths.tmp + 'examples/**/*.html'
  ])
    .pipe(gulp.dest(paths.dist))

  let scss = gulp.src(paths.tmp + 'globals/scss/govuk-frontend.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      postcssnormalize,
      autoprefixer,
      cssnano
    ]))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(eol())
    .pipe(gulp.dest(paths.dist + 'css/'))

  let legacyScss = gulp.src(paths.tmp + 'globals/scss/govuk-frontend-oldie.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        postcssnormalize,
        autoprefixer,
        cssnano,
        require('oldie')({
          rgba: {filter: true},
          rem: {disable: true},
          unmq: {disable: true},
          pseudo: {disable: true}
          // more rules go here
        })
      ])
    )
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(eol())
    .pipe(gulp.dest(paths.dist + 'css/'))

  let js = gulp.src([paths.tmp + '**/*.js'])
      .pipe(concat('govuk-frontend.js', {newLine: '\n;'}))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(eol())
      .pipe(gulp.dest(paths.dist + 'js/'))

  let listComponents = gulp.src(paths.tmp + 'component-list-template.html')
    .pipe(inject(gulp.src([paths.tmp + '/components/**/*.html'])
    .pipe(naturalSort()), {
      starttag: '<!-- inject:componentlinks -->',
      transform: function (filepath, file, i, length) {
        return '<li class="component-link"><a href="components/' + path.basename(file.path, '.html') + '/index.html">' + getName(file) + '</a></li>'
      },
      ignorePath: paths.tmp,
      removeTags: true
    }))
    .pipe(rename({
      basename: 'index'
    }))
    .pipe(replace('.css', '.min.css'))
    .pipe(replace('.js', '.min.js'))
    .pipe(eol())
    .pipe(gulp.dest(paths.dist))

  let copyExamples = gulp.src(paths.tmp + 'examples/**/*')
    .pipe(replace(/(govuk.*\.)(?=(js|css))/g, '$1min.'))
    .pipe(eol())
    .pipe(gulp.dest(paths.dist + 'examples/'))

  return merge(scss, legacyScss, js, listComponents, copy, copyExamples)
})
