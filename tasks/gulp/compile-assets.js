'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')

const merge = require('merge-stream')
const concat = require('gulp-concat')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const rename = require('gulp-rename')

const pluginConfig = require('../../lib/plugins')

// Compile CSS and JS task --------------
// --------------------------------------

// check if destination flag is dist
const isDist = taskArguments.destination === 'dist' || false

const errorHandler = function (error) {
  // Log the error to the console
  console.error(error.message)

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1))
  this.emit('end')
}
// different entry points for both streams below and depending on destination flag
const compileStyleshet = isDist ? configPaths.app + 'assets/scss/govuk-frontend.scss' : configPaths.app + 'assets/scss/app.scss'
const compileOldIeStyleshet = isDist ? configPaths.app + 'assets/scss/govuk-frontend-old-ie.scss' : configPaths.app + 'assets/scss/app-old-ie.scss'

gulp.task('scss:compile', () => {
  let compile = gulp.src(compileStyleshet)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      pluginConfig.plugins.autoprefixer,
      pluginConfig.plugins.cssnano,
      pluginConfig.plugins.postcssnormalize
    ])))
    .pipe(gulpif(!isDist, postcss([
      pluginConfig.plugins.autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      pluginConfig.plugins.postcsspseudoclasses
    ])))
    .pipe(gulpif(isDist,
      rename({
        extname: '.min.css'
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  let compileOldIe = gulp.src(compileOldIeStyleshet)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      pluginConfig.plugins.autoprefixer,
      pluginConfig.plugins.cssnano,
      pluginConfig.plugins.postcssnormalize
      // transpile css for ie https://github.com/jonathantneal/oldie

    ])))
    .pipe(gulpif(!isDist, postcss([
      pluginConfig.plugins.autoprefixer,
      // this plugin needs to be required and configurated inline
      pluginConfig.plugins.postcssoldie
    ])))
    .pipe(gulpif(isDist,
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
  return gulp.src([
    '!' + configPaths.src + '**/*.test.js',
    configPaths.src + '**/*.js'
  ])
    .pipe(concat('govuk-frontend.js'))
    .pipe(gulpif(isDist, uglify()))
    .pipe(gulpif(isDist,
      rename({
        extname: '.min.js'
      })
    ))
    .pipe(eol())
    .pipe(gulp.dest(taskArguments.destination + '/js/'))
})
