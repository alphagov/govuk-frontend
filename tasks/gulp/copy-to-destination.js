'use strict'

const gulp = require('gulp')
const path = require('path')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const filter = require('gulp-filter')
const replace = require('gulp-replace')

let scssFiles = filter([configPaths.govukFrontend + '**/*.scss'], {restore: true})
gulp.task('copy-files', () => {
  return gulp.src([
    path.join(configPaths.govukFrontend, '**/*'),
    path.join('!', configPaths.govukFrontend, 'all{,/**/*}')
  ])
  .pipe(scssFiles)
  .pipe(replace('//start:devonly', '/*start:devonly'))
  .pipe(replace('//end:devonly', 'end:devonly*/'))
  .pipe(postcss([
    autoprefixer,
    require('postcss-nested')
  ], {syntax: require('postcss-scss')}))
  .pipe(scssFiles.restore)
  .pipe(gulp.dest(taskArguments.destination + '/components/'))
})
