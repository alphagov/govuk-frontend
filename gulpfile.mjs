import { join } from 'path'

import gulp from 'gulp'

import { paths } from './config/index.js'
import * as build from './tasks/build/index.mjs'
import { compileJavaScripts } from './tasks/compile-javascripts.mjs'
import { compileStylesheets } from './tasks/compile-stylesheets.mjs'
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
 * Build target tasks
 */
gulp.task('build:app', build.app())
gulp.task('build:package', build.package())
gulp.task('build:dist', build.dist())

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  'build:app',
  watch,
  npmScriptTask('serve', ['--workspace', 'app'])
))
