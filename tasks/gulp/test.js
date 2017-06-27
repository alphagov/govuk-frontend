'use strict'
const gulp = require('gulp')
const gtenon = require('gulp-tenon-client')
const axe = require('gulp-axe-webdriver')

// Check HTML using Tenon ----------------
// ---------------------------------------
gulp.task('html:tenon', function () {
  gulp.src('src/components/**/*.html', {read: false})
  .pipe(gtenon({
    key: 'fc7b85e07ea9b862c6422e412e999f3b',
    snippet: true, // include errorSnippet in the console output
    filter: [
      3,  // Ignore: language of page is not set
      31, // Ignore: link uses an invalid hypertext reference
      64, // Ignore: page has no title
      97  // Ignore: page has no headings
    ]
  }))
})

// Check HTML using aXe ------------------
// ---------------------------------------
// Check HTML using aXe ----------------
// ---------------------------------------

gulp.task('html:axe', (done) => {
  let options = {
    browser: 'phantomjs',
    saveOutputIn: 'axeReport.json',
    urls: ['src/components/**/*.html']
  }
  return axe(options, done)
})
