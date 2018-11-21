'use strict'
const gulp = require('gulp')
const configPaths = require('../../config/paths.json')

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => {
  gulp.watch([configPaths.src + '**/**/*.scss', configPaths.app + 'assets/scss/**/*.scss'], ['styles', 'sassdoc'])
  gulp.watch([configPaths.src + '**/**/*.js'], ['scripts'])
})
