import { join } from 'path'

import gulp from 'gulp'
import taskListing from 'gulp-task-listing'

import { paths, pkg } from './config/index.js'
import { clean } from './tasks/clean.mjs'
import { compileConfig } from './tasks/compile-configs.mjs'
import { compileJavaScripts } from './tasks/compile-javascripts.mjs'
import { compileStylesheets } from './tasks/compile-stylesheets.mjs'
import { version } from './tasks/file.mjs'
import { copyAssets, copyFiles } from './tasks/gulp/copy-to-destination.mjs'
import { watch } from './tasks/gulp/watch.mjs'
import { npmScriptTask } from './tasks/run.mjs'

/**
 * Umbrella scripts tasks (for watch)
 * Runs JavaScript code quality checks, documentation, compilation
 */
gulp.task('scripts', gulp.series(
  compileJavaScripts('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.public, 'javascripts'),

    filePath (file) {
      return join(file.dir, `${file.name}.min.js`)
    }
  }),

  npmScriptTask('build:jsdoc')
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  compileStylesheets('**/[!_]*.scss', {
    srcPath: join(paths.app, 'src/stylesheets'),
    destPath: join(paths.public, 'stylesheets'),

    filePath (file) {
      return join(file.dir, `${file.name}.min.css`)
    }
  }),

  npmScriptTask('build:sassdoc')
))

/**
 * Build review app task
 * Prepare public folder for review app
 */
gulp.task('build:app', gulp.series(
  clean('**/*', {
    destPath: paths.public
  }),

  // Copy GOV.UK Frontend static assets
  copyAssets('**/*', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.public, 'assets')
  }),

  'scripts',
  'styles'
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean('**/*', {
    destPath: paths.package,
    ignore: [
      '**/package.json',
      '**/README.md'
    ]
  }),

  // Copy GOV.UK Frontend files
  copyFiles({
    srcPath: paths.src,
    destPath: paths.package
  }),

  // Copy GOV.UK Frontend JavaScript (ES modules)
  copyAssets('**/!(*.test).mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk-esm')
  }),

  // Compile GOV.UK Frontend JavaScript (AMD modules)
  compileJavaScripts('**/!(*.test).mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk'),

    filePath (file) {
      return join(file.dir, `${file.name}.js`)
    }
  }),

  // Apply CSS prefixes to GOV.UK Frontend Sass
  compileStylesheets('**/*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk'),

    filePath (file) {
      return join(file.dir, `${file.name}.scss`)
    }
  }),

  // Apply CSS prefixes to GOV.UK Prototype Kit Sass
  compileStylesheets('init.scss', {
    srcPath: join(paths.src, 'govuk-prototype-kit'),
    destPath: join(paths.package, 'govuk-prototype-kit'),

    filePath (file) {
      return join(file.dir, `${file.name}.scss`)
    }
  }),

  // Compile GOV.UK Prototype Kit config
  compileConfig('govuk-prototype-kit.config.mjs', {
    srcPath: join(paths.src, 'govuk-prototype-kit'),
    destPath: paths.package,

    filePath (file) {
      return join(file.dir, `${file.name}.json`)
    }
  })
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  clean('**/*', {
    destPath: paths.dist
  }),

  // Copy GOV.UK Frontend static assets
  copyAssets('*/**', {
    srcPath: join(paths.src, 'govuk/assets'),
    destPath: join(paths.dist, 'assets')
  }),

  // Compile GOV.UK Frontend JavaScript
  compileJavaScripts('all.mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.js`)
    }
  }),

  // Compile GOV.UK Frontend Sass
  compileStylesheets('**/[!_]*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: paths.dist,

    filePath (file) {
      return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.css`)
    }
  }),

  // Update GOV.UK Frontend version
  version('VERSION.txt', {
    destPath: paths.dist
  })
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  'build:app',
  watch,
  npmScriptTask('serve', ['--workspace', 'app'])
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)
