'use strict'

const gulp = require('gulp')
const paths = require('../../config/paths.json')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const concat = require('gulp-concat')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const postcssnormalize = require('postcss-normalize')

// Compile CSS and JS task --------------
// --------------------------------------

const isProduction = taskArguments.isProduction

gulp.task('scss:compile', () => {
  let compile = gulp.src(paths.globalScss + 'govuk-frontend.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer,
      gulpif(isProduction, cssnano),
      gulpif(isProduction, postcssnormalize)
    ]))
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.css'
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  let compileOldIe = gulp.src(paths.globalScss + 'govuk-frontend-oldie.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        autoprefixer,
        gulpif(isProduction, cssnano),
        gulpif(isProduction, postcssnormalize),
        require('oldie')({
          rgba: {filter: true},
          rem: {disable: true},
          unmq: {disable: true},
          pseudo: {disable: true}
          // more rules go here
        })
      ])
    )
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.css'
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  return merge(compile, compileOldIe)
})

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  return gulp.src([paths.src + '**/*.js'])
    .pipe(concat('govuk-frontend.js'))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.js'
      })
    ))
    .pipe(eol())
    .pipe(gulp.dest(taskArguments.destination + '/js/'))
})
