const gulp = require('gulp')
const configPaths = require('../../config/paths.js')

/**
 * Watch task
 * During development, this task will:
 * - run `gulp styles` when `.scss` files change
 * - run `gulp scripts` when `.mjs` files change
 */
gulp.task('watch', () => {
  return Promise.all([
    gulp.watch([
      `${configPaths.src}**/**/*.scss`,
      `${configPaths.app}assets/scss/**/*.scss`,
      `${configPaths.fullPageExamples}**/*.scss`,
      `!${configPaths.src}vendor/*`
    ], gulp.series('styles')),

    gulp.watch([
      `${configPaths.src}**/**/*.mjs`
    ], gulp.series('scripts'))
  ])
})
