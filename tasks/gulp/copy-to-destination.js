'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const filter = require('gulp-filter')
const gulpif = require('gulp-if')

let scssFiles = filter([configPaths.src + '**/*.scss'], {restore: true})

// check for the flag passed by the task
const isDist = taskArguments.destination === 'dist' || false

gulp.task('copy-files', () => {
  return gulp.src([
    configPaths.src + '**/*',
    '!' + configPaths.src + '**/*.js',
    '!' + configPaths.src + '**/index.njk',
    '!' + configPaths.src + '**/*.{yml,yaml}'
  ])
  .pipe(scssFiles)
  .pipe(postcss([
    autoprefixer
  ], {syntax: require('postcss-scss')}))
  .pipe(scssFiles.restore)
  .pipe(gulp.dest(
    // output files to dist/components if destination is dist, otherwise copy to packages/
    gulpif(
      isDist,
      taskArguments.destination + '/components/',
      taskArguments.destination + '/'
    ))
  )
})
