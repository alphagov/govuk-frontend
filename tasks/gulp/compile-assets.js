'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const postcssnormalize = require('postcss-normalize')
const postcsspseudoclasses = require('postcss-pseudo-classes')

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
      autoprefixer,
      cssnano,
      postcssnormalize
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      postcsspseudoclasses
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
      autoprefixer,
      cssnano,
      postcssnormalize,
      // transpile css for ie https://github.com/jonathantneal/oldie
      require('oldie')({
        rgba: {filter: true},
        rem: {disable: true},
        unmq: {disable: true},
        pseudo: {disable: true}
        // more rules go here
      })
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      require('oldie')({
        rgba: {filter: true},
        rem: {disable: true},
        unmq: {disable: true},
        pseudo: {disable: true}
        // more rules go here
      })
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
gulp.task('js:compile', (callback) => {
  const { exec } = require('child_process')
  const output = taskArguments.destination
  const outputEnvironment = output ? `OUTPUT=${output} ` : ''

  // Note: We're executing Webpack directly rather than using a Gulp plugin since we intend
  // to use Webpack to compile the other aspects of govuk-frontend.
  exec(`${outputEnvironment} node_modules/.bin/webpack --config config/webpack.config.js`, (err, stdout, stderr) => {
    if (stderr) {
      return callback(stderr)
    }
    if (err) {
      return callback(stdout)
    }
    console.log(stdout)
    callback(err)
  })
})
