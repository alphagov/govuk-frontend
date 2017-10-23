'use strict'

const configPaths = require('../../config/paths.json')
const gulp = require('gulp')
const debug = require('gulp-debug')
const nunjucks = require('gulp-nunjucks')
const rename = require('gulp-rename')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')

// Compile Nunjucks ----------------------
// Compile Nunjucks to HTML
// ---------------------------------------

const isPackages = (taskArguments.destination === 'packages') || false
gulp.task('compile:components', () => {
  return gulp.src(
    [
      '!' + configPaths.components + '**/index.njk',
      '!' + configPaths.components + '**/macro.njk',
      '!' + configPaths.components + '**/template.njk',
      configPaths.components + '**/*.njk' // Only compile componentname.njk to html
    ])
    .pipe(debug())
    .pipe(nunjucks.compile('', {
      trimBlocks: true, // automatically remove trailing newlines from a block/tag
      lstripBlocks: true // automatically remove leading whitespace from a block/tag
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(gulpif(isPackages, taskArguments.destination, taskArguments.destination + '/components/')))
})
