'use strict'
const gulp = require('gulp')
const mocha = require('gulp-mocha')

gulp.task('test:app', function (done) {
  return gulp.src(['test/app.spec.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .once('error', () => {
      process.exit(1)
    })
    .once('end', () => {
      process.exit()
    })
})
