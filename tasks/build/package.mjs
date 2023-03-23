import { join } from 'path'

import gulp from 'gulp'

import { paths } from '../../config/index.js'
import { configs, files, scripts, styles } from '../index.mjs'

/**
 * Build package task
 * Prepare package folder for publishing
 *
 * @returns {() => import('gulp').TaskFunction} Task function
 */
export default () => gulp.series(
  files.clean('**/*', {
    destPath: paths.package,
    ignore: [
      '**/package.json',
      '**/README.md'
    ]
  }),

  // Copy GOV.UK Frontend files
  files.copyFiles({
    srcPath: paths.src,
    destPath: paths.package
  }),

  // Copy GOV.UK Frontend JavaScript (ES modules)
  files.copyAssets('**/!(*.test).mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk-esm')
  }),

  // Compile GOV.UK Frontend JavaScript (AMD modules)
  scripts.compile('**/!(*.test).mjs', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk'),

    filePath (file) {
      return join(file.dir, `${file.name}.js`)
    }
  }),

  // Apply CSS prefixes to GOV.UK Frontend Sass
  styles.compile('**/*.scss', {
    srcPath: join(paths.src, 'govuk'),
    destPath: join(paths.package, 'govuk'),

    filePath (file) {
      return join(file.dir, `${file.name}.scss`)
    }
  }),

  // Apply CSS prefixes to GOV.UK Prototype Kit Sass
  styles.compile('init.scss', {
    srcPath: join(paths.src, 'govuk-prototype-kit'),
    destPath: join(paths.package, 'govuk-prototype-kit'),

    filePath (file) {
      return join(file.dir, `${file.name}.scss`)
    }
  }),

  // Compile GOV.UK Prototype Kit config
  configs.compile('govuk-prototype-kit.config.mjs', {
    srcPath: join(paths.src, 'govuk-prototype-kit'),
    destPath: paths.package,

    filePath (file) {
      return join(file.dir, `${file.name}.json`)
    }
  })
)
