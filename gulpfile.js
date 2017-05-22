const paths = require('./config/paths.json')
const gulp = require('gulp')
const sasslint = require('gulp-sass-lint')
const sass = require('gulp-sass');

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------
gulp.task('default', () => {
  // place code for your default task here
})

// Sass lint task
gulp.task('lint:styles', () => {
  return gulp.src(paths.src + '**/*.scss')
    .pipe(sasslint({
      configFile: paths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})

// Sass build task
gulp.task('sass:build', () => {
  return gulp.src(paths.globalScss + '**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.distCss))
})
