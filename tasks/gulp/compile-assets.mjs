
import { readFile } from 'fs/promises'
import { join, parse } from 'path'

import gulp from 'gulp'
import rollup from 'gulp-better-rollup'
import gulpif from 'gulp-if'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import gulpSass from 'gulp-sass'
import uglify from 'gulp-uglify'
import merge from 'merge-stream'
import minimatch from 'minimatch'
import nodeSass from 'node-sass'
import PluginError from 'plugin-error'
import slash from 'slash'

import configPaths from '../../config/paths.js'
import { getListing } from '../../lib/file-helper.js'
import { componentNameToJavaScriptModuleName } from '../../lib/helper-functions.js'
import { destination, isDev, isDist, isPackage } from '../task-arguments.mjs'

const sass = gulpSass(nodeSass)
const pkg = JSON.parse(await readFile(join(configPaths.package, 'package.json'), 'utf8'))

/**
 * Compile Sass to CSS task
 *
 * @returns {import('stream').Stream} Output file stream
 */
export function compileStylesheets () {
  const destPath = isPackage
    ? join(destination, 'govuk')
    : destination

  // Release distribution
  if (isDist) {
    return merge(
      compileStylesheet(
        gulp.src(`${slash(configPaths.src)}/govuk/all.scss`, {
          sourcemaps: true
        })
          .pipe(rename({
            basename: 'govuk-frontend',
            suffix: `-${pkg.version}.min`,
            extname: '.css'
          }))),

      compileStylesheet(
        gulp.src(`${slash(configPaths.src)}/govuk/all-ie8.scss`, {
          sourcemaps: true
        })
          .pipe(rename({
            basename: 'govuk-frontend-ie8',
            suffix: `-${pkg.version}.min`,
            extname: '.css'
          })))
    )
      .pipe(gulp.dest(slash(destPath), {
        sourcemaps: '.'
      }))
  }

  // Review application
  return merge(
    compileStylesheet(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app?(-ie8).scss`, {
        sourcemaps: true
      })),

    compileStylesheet(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app-legacy?(-ie8).scss`, {
        sourcemaps: true
      }), {
        includePaths: [
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules'
        ]
      }),

    compileStylesheet(
      gulp.src(`${slash(configPaths.fullPageExamples)}/**/styles.scss`, {
        sourcemaps: true
      })
        .pipe(rename((path) => {
          path.basename = path.dirname
          path.dirname = 'full-page-examples'
        })))
  )
    .pipe(gulp.dest(slash(destPath), {
      sourcemaps: '.'
    }))
}

compileStylesheets.displayName = 'compile:scss'

/**
 * Compile Sass to CSS helper
 *
 * @param {import('stream').Stream} stream - Input file stream
 * @param {import('node-sass').Options} [options] - Sass options
 * @returns {import('stream').Stream} Output file stream
 */
function compileStylesheet (stream, options = {}) {
  return stream
    .pipe(plumber(errorHandler(stream, 'compile:scss')))
    .pipe(sass(options))
    .pipe(postcss())
    .pipe(plumber.stop())
}

/**
 * Compile JavaScript ESM to CommonJS task
 *
 * @returns {Promise<import('stream').Stream>} Output file stream
 */
export async function compileJavaScripts () {
  const destPath = isPackage
    ? join(destination, 'govuk')
    : destination

  // For dist/ folder we only want compiled 'all.js'
  // For non dist/ folder we want to exclude test and spec files
  // See https://github.com/micromatch/micromatch#extglobs for extglobs matching syntax
  const fileLookup = isDist ? 'govuk/all.mjs' : 'govuk/**/!(*.+(test|spec)).mjs'

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

    return compileJavaScript(gulp.src(slash(join(configPaths.src, file)), {
      sourcemaps: true
    }), moduleName)
      .pipe(gulp.dest(slash(join(destPath, modulePath)), {
        sourcemaps: '.'
      }))
  }))
}

compileJavaScripts.displayName = 'compile:js'

/**
 * Compile JavaScript ESM to CommonJS helper
 *
 * @param {import('stream').Stream} stream - Input file stream
 * @param {string} moduleName - Rollup module name
 * @returns {import('stream').Stream} Output file stream
 */
function compileJavaScript (stream, moduleName) {
  return stream
    .pipe(plumber(errorHandler(stream, 'compile:js')))

    // Compile JavaScript ESM to CommonJS
    .pipe(rollup({
      // Used to set the `window` global and UMD/AMD export name
      // Component JavaScript is given a unique name to aid individual imports, e.g GOVUKFrontend.Accordion
      name: moduleName,
      // Legacy mode is required for IE8 support
      legacy: true,
      // UMD allows the published bundle to work in CommonJS and in the browser.
      format: 'umd'
    }))

    // Minify
    .pipe(gulpif(isDist, uglify({
      ie8: true
    })))

    .pipe(plumber.stop())

    // Rename
    .pipe(gulpif(isDist,
      rename({
        basename: 'govuk-frontend',
        suffix: `-${pkg.version}.min`
      })
    ))
    .pipe(rename({
      extname: '.js'
    }))
}

/**
 * Compiler error handler
 *
 * Sets up Gulp plumber to suppress errors during development
 * and logs custom errors from Gulp plugins where available
 *
 * @param {import('stream').Stream} stream - Input file stream
 * @returns {import('stream').Stream} Output file stream
 */
function errorHandler (stream, name) {
  return function (cause) {
    const error = new PluginError(cause.plugin || name, cause.messageFormatted || cause)

    // Gulp plugin logging in development
    // unless already formatted and logged
    if (isDev || !cause.messageFormatted) {
      console.error(error.toString())
    }

    // Gulp continue (watch)
    if (isDev) {
      return this.emit('end')
    }

    // Gulp exit with error
    return stream.emit('error', error)
  }
}
