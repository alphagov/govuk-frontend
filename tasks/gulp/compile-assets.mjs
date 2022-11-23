
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
import slash from 'slash'

import configPaths from '../../config/paths.js'
import { getListing } from '../../lib/file-helper.js'
import { componentNameToJavaScriptModuleName } from '../../lib/helper-functions.js'
import { destination, isDist, isPackage } from '../task-arguments.mjs'

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
        gulp.src(`${slash(configPaths.src)}/govuk/all.scss`)
          .pipe(rename({
            basename: 'govuk-frontend',
            extname: '.min.css'
          }))),

      compileStylesheet(
        gulp.src(`${slash(configPaths.src)}/govuk/all-ie8.scss`)
          .pipe(rename({
            basename: 'govuk-frontend-ie8',
            extname: '.min.css'
          })))
    )
      .pipe(gulp.dest(slash(destPath)))
  }

  // Review application
  return merge(
    compileStylesheet(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app?(-ie8).scss`)),

    compileStylesheet(
      gulp.src(`${slash(configPaths.app)}/assets/scss/app-legacy?(-ie8).scss`), {
        includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
      }),

    compileStylesheet(
      gulp.src(`${slash(configPaths.fullPageExamples)}/**/styles.scss`)
        .pipe(rename((path) => {
          path.basename = path.dirname
          path.dirname = 'full-page-examples'
        })))
  )
    .pipe(gulp.dest(slash(destPath)))
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
    .pipe(plumber())
    .pipe(sass(options))
    .pipe(postcss())
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
  const fileLookup = isDist ? 'govuk/all.mjs' : 'govuk/**/!(*.test).mjs'

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
}

compileJavaScripts.displayName = 'compile:js'
