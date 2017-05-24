'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sasslint = require('gulp-sass-lint')
const sass = require('gulp-sass')
const runsequence = require('run-sequence')
const gls = require('gulp-live-server')
const concat = require('gulp-concat')

// Styles build task ---------------------
// Compiles CSS from Sass
// Output both a minified and non-minified version into /public/stylesheets/
// ---------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

gulp.task('scss:lint', () => {
  return gulp.src(paths.src + '**/*.scss')
    .pipe(sasslint({
      configFile: paths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})

gulp.task('scss:compile', () => {
  return gulp.src(paths.globalScss + '**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.distCss))
})

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => {
  gulp.watch([paths.src + '**/**/*.scss'], ['styles'])
})

// Dev task --------------------------
// Compiles assets and sets up watches.
// ---------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'watch', cb)
})

// Serve task --------------------------
// Creates a server to preview components
// ---------------------------------------
gulp.task('serve', function() {
  const server = gls.static(paths.dist + 'html/', 8888)
  server.start()
})

// Combine html task --------------------------
// Combines all html files in components into a single  file
// ---------------------------------------
gulp.task('combine:html', function() {
  return gulp.src(paths.src + 'components/**/*.html')
    .pipe(concat('index.html'))
    .pipe(gulp.dest(paths.dist + '/html/'))
})

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------
gulp.task('default', () => {
  const cyan = gutil.colors.cyan
  const green = gutil.colors.green

  gutil.log(green('----------'))

  gutil.log(('The following main ') + cyan('tasks') + (' are available:'))

  gutil.log(cyan('dev'
    ) + ': compiles assets then sets up watches.'
  )

  gutil.log(green('----------'))
})
