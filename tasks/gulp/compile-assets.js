const { getListing } = require('../../lib/file-helper')
const { componentNameToJavaScriptModuleName } = require('../../lib/helper-functions')

const { join, parse } = require('path')

const gulp = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rollup = require('gulp-better-rollup')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const minimatch = require('minimatch')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const slash = require('slash')

const configPaths = require('../../config/paths.js')
const { destination, isDist, isPackage } = require('../task-arguments.js')

/**
 * Compile Sass to CSS task
 */
gulp.task('scss:compile', function () {
  const destPath = isPackage
    ? join(destination, 'govuk')
    : destination

  // Release distribution
  if (isDist) {
    return merge(
      compileStyles(
        gulp.src(`${slash(configPaths.src)}/all.scss`)
          .pipe(rename({
            basename: 'govuk-frontend',
            extname: '.min.css'
          }))),

      compileStyles(
        gulp.src(`${slash(configPaths.src)}/all-ie8.scss`)
          .pipe(rename({
            basename: 'govuk-frontend-ie8',
            extname: '.min.css'
          })))
    )
      .pipe(gulp.dest(slash(destPath)))
  }

  // Review application
  return merge(
    compileStyles(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app?(-ie8).scss`)),

    compileStyles(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app-legacy?(-ie8).scss`), {
        includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
      }),

    compileStyles(
      gulp.src(`${slash(configPaths.fullPageExamples)}/**/styles.scss`)
        .pipe(rename((path) => {
          path.basename = path.dirname
          path.dirname = 'full-page-examples'
        })))
  )
    .pipe(gulp.dest(slash(destPath)))
})

/**
 * Compile Sass to CSS helper
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

/**
 * Compile JavaScript ESM to CommonJS task
 */
gulp.task('js:compile', async () => {
  const destPath = isPackage
    ? join(destination, 'govuk')
    : destination

  // For dist/ folder we only want compiled 'all.js'
  const fileLookup = isDist ? 'all.mjs' : '**/!(*.test).mjs'

  // Perform a search and return an array of matching file names
  const srcFiles = await getListing(configPaths.src, fileLookup)

  return merge(srcFiles.map((file) => {
    const { dir: srcPath, name } = parse(file)

    // This is combined with destPath in gulp.dest()
    // so the files are output to the correct folders
    const modulePath = slash(srcPath).replace(/^govuk\/?/, '')

    // We only want to give component JavaScript a unique module name
    const moduleName = minimatch(srcPath, '**/components/**')
      ? componentNameToJavaScriptModuleName(name)
      : 'GOVUKFrontend'

    return gulp.src(slash(join(configPaths.src, file)))
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
      .pipe(gulp.dest(slash(join(destPath, modulePath))))
  }))
})
