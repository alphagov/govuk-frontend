'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const gls = require('gulp-live-server')

// Serve task ---------------------------
// Creates a server to preview components
// ---------------------------------------
gulp.task('serve:preview', () => {
  const server = gls.static(paths.preview, 9999)
  server.start()
})

// Serve demo task -----------------------
// Creates a server to demo components
// ---------------------------------------
gulp.task('serve:demo', () => {
  const server = gls.static(paths.demo, 8888)
  server.start()
})
