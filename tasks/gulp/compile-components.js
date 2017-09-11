'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const rename = require('gulp-rename')
const taskArguments = require('./task-arguments')

// Compile Nunjucks ----------------------
// Compile Nunjucks to HTML
// ---------------------------------------
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
    .pipe(gulp.dest(taskArguments.destination + '/components/'))
})
