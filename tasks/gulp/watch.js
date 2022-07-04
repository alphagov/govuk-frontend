'use strict'
const gulp = require('gulp')
const configPaths = require('../../config/paths.json')

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => Promise.all([
  gulp.watch([configPaths.src + '**/**/*.scss', configPaths.app + 'assets/scss/**/*.scss', configPaths.fullPageExamples + '**/*.scss'], gulp.parallel('styles', 'sassdoc')),
  gulp.watch([configPaths.src + '**/**/*.mjs'], gulp.series('scripts'))
]))
