const gulp = require('gulp')
const slash = require('slash')

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
      'sassdoc.config.yaml',
      `${slash(configPaths.src)}/govuk/**/**/*.scss`,
      `${slash(configPaths.app)}/assets/scss/**/*.scss`,
      `${slash(configPaths.fullPageExamples)}/**/*.scss`,
      `!${slash(configPaths.src)}/govuk/vendor/*`
    ], gulp.series('styles')),

    gulp.watch([
      'jsdoc.config.js',
      `${slash(configPaths.src)}/govuk/**/*.mjs`
    ], gulp.series('scripts'))
  ])
})
