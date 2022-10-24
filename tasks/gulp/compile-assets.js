const { componentNameToJavaScriptModuleName } = require('../../lib/helper-functions')

const path = require('path')

const gulp = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rollup = require('gulp-better-rollup')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const glob = require('glob')
const merge = require('merge-stream')
const rename = require('gulp-rename')

const configPaths = require('../../config/paths.js')
const { destination, isDist, isPackage } = require('../task-arguments.js')

// Compile CSS and JS task --------------
// --------------------------------------

// Determine destination namespace
function destinationPath () {
  return isPackage ? `${destination}/govuk` : destination
}

gulp.task('scss:compile', function () {
  /**
   * Release distribution
   */
  if (isDist) {
    return merge(
      compileStyles(
        gulp.src(`${configPaths.src}all.scss`)
          .pipe(rename({
            basename: 'govuk-frontend',
            extname: '.min.css'
          }))),

      compileStyles(
        gulp.src(`${configPaths.src}all-ie8.scss`)
          .pipe(rename({
            basename: 'govuk-frontend-ie8',
            extname: '.min.css'
          })))
    )
      .pipe(gulp.dest(destination))
  }

  /**
   * Review application
   */
  return merge(
    compileStyles(
      gulp.src(`${configPaths.app}assets/scss/app?(-ie8).scss`)),

    compileStyles(
      gulp.src(`${configPaths.app}assets/scss/app-legacy?(-ie8).scss`), {
        includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
      }),

    compileStyles(
      gulp.src(`${configPaths.fullPageExamples}**/styles.scss`)
        .pipe(rename((path) => {
          path.basename = path.dirname
          path.dirname = 'full-page-examples'
        })))
  )
    .pipe(gulp.dest(destinationPath()))
})

/**
 * Compile Sass to CSS
 *
 * @param {import('stream').Stream} stream - Input file stream
 * @param {import('node-sass').Options} [options] - Sass options
 * @returns {import('stream').Stream} Output file stream
 */
function compileStyles (stream, options = {}) {
  return stream
    .pipe(plumber((error) => {
      console.error(error.message)

      // Ensure the task we're running exits with an error code
      stream.once('finish', () => process.exit(1))
      stream.emit('end')
    }))
    .pipe(sass(options))
    .pipe(postcss())
}

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  // For dist/ folder we only want compiled 'all.js'
  const fileLookup = isDist ? configPaths.src + 'all.mjs' : configPaths.src + '**/!(*.test).mjs'

  // Perform a synchronous search and return an array of matching file names
  const srcFiles = glob.sync(fileLookup)

  return merge(srcFiles.map(function (file) {
    // This is combined with destinationPath in gulp.dest()
    // so the files are output to the correct folders
    const newDirectoryPath = path.dirname(file).replace('src/govuk', '')

    // We only want to give component JavaScript a unique module name
    let moduleName = 'GOVUKFrontend'
    if (path.dirname(file).includes('/components/')) {
      moduleName = componentNameToJavaScriptModuleName(path.parse(file).name)
    }

    return gulp.src(file)
      .pipe(rollup({
        // Used to set the `window` global and UMD/AMD export name
        // Component JavaScript is given a unique name to aid individual imports, e.g GOVUKFrontend.Accordion
        name: moduleName,
        // Legacy mode is required for IE8 support
        legacy: true,
        // UMD allows the published bundle to work in CommonJS and in the browser.
        format: 'umd'
      }))
      .pipe(gulpif(isDist, uglify({
        ie8: true
      })))
      .pipe(gulpif(isDist,
        rename({
          basename: 'govuk-frontend',
          extname: '.min.js'
        })
      ))
      .pipe(rename({
        extname: '.js'
      }))
      .pipe(gulp.dest(destinationPath() + newDirectoryPath))
  }))
})
