const { componentNameToJavaScriptModuleName } = require('../../lib/helper-functions')

const path = require('path')

const gulp = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const rollup = require('gulp-better-rollup')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const glob = require('glob')
const merge = require('merge-stream')
const rename = require('gulp-rename')

const configPaths = require('../../config/paths.js')
const { destination, isDist, isPublic } = require('../task-arguments.js')

// Compile CSS and JS task --------------
// --------------------------------------

// Set the destination
const destinationPath = function () {
  // Public & Dist directories not namespaced with `govuk`
  if (isDist || isPublic) {
    return destination
  } else {
    return `${destination}/govuk/`
  }
}

const errorHandler = function (error) {
  // Log the error to the console
  console.error(error.message)

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1))
  this.emit('end')
}

function compileStyles () {
  const compileStylesheet = isDist ? configPaths.src + 'all.scss' : configPaths.app + 'assets/scss/app.scss'

  return gulp.src(compileStylesheet)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(gulpif(isDist,
      rename({
        basename: 'govuk-frontend',
        extname: '.min.css'
      })
    ))
    .pipe(postcss())
    .pipe(gulp.dest(`${destination}/`))
}

function compileOldIE () {
  const compileOldIeStylesheet = isDist ? configPaths.src + 'all-ie8.scss' : configPaths.app + 'assets/scss/app-ie8.scss'

  return gulp.src(compileOldIeStylesheet)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(gulpif(isDist,
      rename({
        basename: 'govuk-frontend-ie8',
        extname: '.min.css'
      })
    ))
    .pipe(postcss())
    .pipe(gulp.dest(`${destination}/`))
}

function compileLegacy () {
  return gulp.src(path.join(configPaths.app, 'assets/scss/app-legacy.scss'))
    .pipe(plumber(errorHandler))
    .pipe(sass({
      includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
    }))
    .pipe(postcss())
    .pipe(gulp.dest(`${destination}/`))
}

function compileLegacyIE () {
  return gulp.src(path.join(configPaths.app, 'assets/scss/app-legacy-ie8.scss'))
    .pipe(plumber(errorHandler))
    .pipe(sass({
      includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
    }))
    .pipe(postcss())
    .pipe(gulp.dest(`${destination}/`))
}

function compileFullPageStyles () {
  const compileFullPageExampleStylesheets = configPaths.fullPageExamples + '**/styles.scss'

  return gulp.src(compileFullPageExampleStylesheets)
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(rename(function (location) {
      location.basename = location.dirname
      location.dirname = ''
    }))
    .pipe(gulp.dest(`${destination}/full-page-examples/`))
}

gulp.task('scss:compile', function (done) {
  // Default tasks if compiling for dist
  const tasks = [compileStyles(), compileOldIE()]

  if (isPublic || !isDist) {
    tasks.push(compileLegacy(), compileLegacyIE())

    if (isPublic) {
      tasks.push(compileFullPageStyles())
    }
  }

  return Promise.all(tasks)
})

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
      .pipe(eol())
      .pipe(gulp.dest(destinationPath() + newDirectoryPath))
  }))
})
