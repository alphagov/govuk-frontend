'use strict'

const gulp = require('gulp')
const path = require('path')
const configPaths = require('../../config/paths.json')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const concat = require('gulp-concat')
const taskArguments = require('./task-arguments')
const eol = require('gulp-eol')
const postcsspseudoclasses = require('postcss-pseudo-classes')

// Compile CSS and JS task --------------
// --------------------------------------

gulp.task('review:scss:compile', () => {
  let compile = gulp.src(path.join(configPaths.app, 'assets/scss/app.scss'))
    .pipe(sass({
      includePaths: configPaths.packages
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      postcsspseudoclasses
    ]))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  let compileOldIe = gulp.src(path.join(configPaths.app, 'assets/scss/app-oldie.scss'))
    .pipe(sass({
      includePaths: configPaths.packages
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer,
      require('oldie')({
        rgba: {filter: true},
        rem: {disable: true},
        unmq: {disable: true},
        pseudo: {disable: true}
        // more rules go here
      })
    ]))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  return merge(compile, compileOldIe)
})

// Compile js task for preview ----------
// --------------------------------------
gulp.task('review:js:compile', () => {
  return gulp.src([
    '!' + configPaths.components + '**/*.test.js',
    configPaths.components + '**/*.js'
  ])
    .pipe(concat('app.js'))
    .pipe(eol())
    .pipe(gulp.dest(taskArguments.destination + '/js/'))
})
