'use strict'
const gulp = require('gulp')
const gtenon = require('gulp-tenon-client')
const configPaths = require('../../config/paths.json')

// Check HTML using Tenon ----------------
// ---------------------------------------
gulp.task('html:tenon', function () {
  return gulp.src(configPaths.publicComponents + '**/*.html', {read: false})
  .pipe(gtenon({
    config: 'config/tenon.json',
    snippet: true, // include errorSnippet in the console output
    filter: [
      3,  // Ignore: language of page is not set
      31, // Ignore: link uses an invalid hypertext reference
      64, // Ignore: page has no title
      97  // Ignore: page has no headings
    ]
  }))
})
