'use strict'
const gulp = require('gulp')
const gtenon = require('gulp-tenon-client')
const axe = require('gulp-axe-webdriver')
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

// Check HTML using aXe ------------------
// ---------------------------------------
gulp.task('html:axe', (done) => {
  let options = {
    browser: 'phantomjs',
    saveOutputIn: 'axeReport.json',
    urls: [configPaths.publicComponents + '**/*.html'],
    // https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
    a11yCheckOptions: {
      'rules': {
        'document-title': { 'enabled': false }, // Ensures each HTML document contains a non-empty <title> element
        'html-has-lang': { 'enabled': false },  // Ensures every HTML document has a lang attribute
        'bypass': { 'enabled': false }          // Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content
      }
    }
  }
  return axe(options, done)
})
