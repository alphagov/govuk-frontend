const gulp = require('gulp')
const configPaths = require('../../config/paths.js')
const buildSassdocs = require('../sassdoc.js')

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => Promise.all([
  gulp.watch([configPaths.src + '**/**/*.scss', configPaths.app + 'assets/scss/**/*.scss', configPaths.fullPageExamples + '**/*.scss'], gulp.parallel('styles', buildSassdocs)),
  gulp.watch([configPaths.src + '**/**/*.mjs'], gulp.series('scripts'))
]))
