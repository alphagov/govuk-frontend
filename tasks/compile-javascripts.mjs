import { join, parse } from 'path'

import gulp from 'gulp'
import rollup from 'gulp-better-rollup'
import gulpif from 'gulp-if'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import merge from 'merge-stream'
import slash from 'slash'

import config from '../config/index.js'
import { getListing } from '../lib/file-helper.js'
import { componentPathToModuleName } from '../lib/helper-functions.js'

import { errorHandler } from './gulp/compile-assets.mjs'
import { destination, isDist, isPackage } from './task-arguments.mjs'

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
  const srcFiles = await getListing(config.paths.src, fileLookup)

  return merge(srcFiles.map((file) => {
    const { dir: srcPath } = parse(file)

    // This is combined with destPath in gulp.dest()
    // so the files are output to the correct folders
    const modulePath = slash(srcPath).replace(/^govuk\/?/, '')

    // We only want to give component JavaScript a unique module name
    const moduleName = componentPathToModuleName(file)

    return compileJavaScript(gulp.src(slash(join(config.paths.src, file)), {
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
        suffix: `-${config.pkg.version}.min`
      })
    ))
    .pipe(rename({
      extname: '.js'
    }))
}
