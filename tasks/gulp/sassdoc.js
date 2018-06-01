const sassdoc = require('sassdoc')
const gulp = require('gulp')
const paths = require('../../config/paths.json')
const debug = require('gulp-debug')

gulp.task('sassdoc', function () {
  return gulp.src([paths.src + '**/**/*.scss', `!${paths.src}/vendor/*`])
    .pipe(debug())
    .pipe(sassdoc({
      dest: paths.sassdoc,
      groups: {
        tools: 'Tools',
        helpers: 'Helpers',
        overrides: 'Overrides'
      }
    }))
    .resume()
})
