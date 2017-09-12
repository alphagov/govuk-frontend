'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const rename = require('gulp-rename')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const flatten = require('gulp-flatten')

// Compile Nunjucks ----------------------
// Compile Nunjucks to HTML
// ---------------------------------------

const isPackages = (taskArguments.destination === 'packages') || false
gulp.task('compile:components', () => {
  return gulp.src(
    [
      '!' + paths.components + '**/index.njk',
      '!' + paths.components + '**/macro.njk',
      '!' + paths.components + '**/template.njk',
      paths.components + '**/*.njk' // Only compile componentname.njk to html
    ])
    .pipe(nunjucks.compile({ lstripBlocks: true, trimBlocks: true }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(gulpif(isPackages, taskArguments.destination, taskArguments.destination + '/components/')))
})
