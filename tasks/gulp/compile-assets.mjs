
import { join } from 'path'

import gulp from 'gulp'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import gulpSass from 'gulp-sass'
import merge from 'merge-stream'
import nodeSass from 'node-sass'
import PluginError from 'plugin-error'
import slash from 'slash'

import { paths, pkg } from '../../config/index.js'
import { destination, isDev, isDist, isPackage } from '../task-arguments.mjs'

const sass = gulpSass(nodeSass)

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
        gulp.src(`${slash(paths.src)}/govuk/all.scss`, {
          sourcemaps: true
        })
          .pipe(rename({
            basename: 'govuk-frontend',
            suffix: `-${pkg.version}.min`,
            extname: '.css'
          }))),

      compileStylesheet(
        gulp.src(`${slash(paths.src)}/govuk/all-ie8.scss`, {
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
      gulp.src(`${slash(paths.app)}/assets/scss/app?(-ie8).scss`, {
        sourcemaps: true
      })),

    compileStylesheet(
      gulp.src(`${slash(paths.app)}/assets/scss/app-legacy?(-ie8).scss`, {
        sourcemaps: true
      }), {
        includePaths: [
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules'
        ]
      }),

    compileStylesheet(
      gulp.src(`${slash(paths.fullPageExamples)}/**/styles.scss`, {
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
 * Compiler error handler
 *
 * Sets up Gulp plumber to suppress errors during development
 * and logs custom errors from Gulp plugins where available
 *
 * @param {import('stream').Stream} stream - Input file stream
 * @param {string} name - Task name for non-plugin error logging
 * @returns {import('stream').Stream} Output file stream
 */
export function errorHandler (stream, name) {
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
