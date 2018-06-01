const sassdoc = require('sassdoc')
const gulp = require('gulp')
const paths = require('../../config/paths.json')

gulp.task('sassdoc', function () {
  return gulp.src(paths.src + '**/*.scss')
    .pipe(sassdoc({
      dest: paths.sassdoc,
      groups: {
        tools: 'Tools',
        helpers: 'Helpers',
        overrides: 'Overrides'
      },
      exclude: [
        paths.src + 'vendor/*'
      ]
    }))
    .resume()
})
