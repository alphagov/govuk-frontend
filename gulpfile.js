const paths = require('./config/paths.json')
const gulp = require('gulp')
const sasslint = require('gulp-sass-lint')

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------
gulp.task('default', () => {
  // place code for your default task here
})

// Sass lint task
gulp.task('lint:styles', () => {
  return gulp.src(paths.assetsScss + '**/*.scss')
    .pipe(sasslint({
      configFile: paths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})
