import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../config/index.js'
import { clean } from '../clean.mjs'
import { compileConfig } from '../compile-configs.mjs'
import { compileJavaScripts } from '../compile-javascripts.mjs'
import { compileStylesheets } from '../compile-stylesheets.mjs'
import { copyAssets, copyFiles } from '../gulp/copy-to-destination.mjs'

/**
 * Build package task
 * Prepare package folder for publishing
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
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
)
