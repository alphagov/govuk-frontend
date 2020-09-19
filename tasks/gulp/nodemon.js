'use strict'
const gulp = require('gulp')
const nodemon = require('nodemon')
const paths = require('../../config/paths.json')

// Nodemon task --------------------------
// Restarts node app for changes affecting
// js and json files
// ---------------------------------------
gulp.task('nodemon', () => {
  return nodemon({
    watch: [
      paths.app,
      paths.src
    ],
    script: 'app/start.js'
  })
})
