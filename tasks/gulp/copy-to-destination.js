'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const filter = require('gulp-filter')

let scssFiles = filter([configPaths.src + '**/*.scss'], {restore: true})

gulp.task('copy-files', () => {
  return gulp.src([
    configPaths.src + '**/*',
    '!' + configPaths.src + '**/*.{test,js}',
    '!' + configPaths.src + '**/index.njk',
    '!' + configPaths.src + '**/*.{yml,yaml}',
    '!' + configPaths.src + '**/__snapshots__/**',
    '!' + configPaths.src + '**/__snapshots__/'
  ])
  .pipe(scssFiles)
  .pipe(postcss([
    autoprefixer
  ], {syntax: require('postcss-scss')}))
  .pipe(scssFiles.restore)
  .pipe(gulp.dest(taskArguments.destination + '/'))
})
