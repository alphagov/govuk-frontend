'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sasslint = require('gulp-sass-lint')
const sass = require('gulp-sass')
const runsequence = require('run-sequence')
const gls = require('gulp-live-server')
const inject = require('gulp-inject')
const concat = require('gulp-concat')
const standard = require('gulp-standard')

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

// Scripts build tasks --------------------
// Lints, compiles javascript partials
gulp.task('js:compile', () => {
  return gulp.src([paths.src + '/**/*.js'])
    .pipe(concat('govuk-frontend.js'))
    .pipe(gulp.dest(paths.dist + 'js'))
})
gulp.task('js:lint', () => {
  return gulp.src([paths.components + '**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('scripts', cb => {
  runsequence('js:lint', 'js:compile', cb)
})

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => {
  gulp.watch([paths.src + '**/**/*.scss'], ['styles'])
  gulp.watch([paths.src + '**/**/*.js'], ['scripts'])
  gulp.watch([paths.components + '**/*.html'], ['preview:components'])
})

// Dev task --------------------------
// Compiles assets and sets up watches.
// ---------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'scripts',
              'preview:components',
              'serve',
              'watch', cb)
})

// Serve task --------------------------
// Creates a server to preview components
// ---------------------------------------
gulp.task('serve', () => {
  const server = gls.static(paths.dist, 8888)
  server.start()
})

// Preview components --------------------------
// Combines all html files in components into a single  file
// Inserts compiled component css into the head of the page
// ---------------------------------------
gulp.task('preview:components', () => {
  gulp.src(paths.src + 'index.html')
  .pipe(inject(gulp.src([paths.src + 'components/**/*.html']), {
    starttag: '<!-- inject:html -->',
    transform: function (filePath, file) {
      return '<div class="component">' + file.contents.toString('utf8') + '</div>'
    }
  }))
  .pipe(inject(gulp.src(paths.distCss + '*-oldie.css', {read: false}), {starttag: '<!- - oldie:css - ->', endtag: '<!- - oldieend:css - ->', ignorePath: paths.dist}))
  .pipe(inject(gulp.src([paths.distCss + '*.css', '!' + paths.distCss + '*-oldie.css'], {read: false}), {name: 'head', ignorePath: paths.dist}))
  .pipe(inject(gulp.src([paths.distJs + '*.js', paths.distJs], {read: false}), {ignorePath: paths.dist}))
  .pipe(gulp.dest(paths.dist))
  gulp.start('copy:images')
})

// Copy images --------------------------
// Copy images to dist for component preview
// ---------------------------------------
gulp.task('copy:images', () => {
  return gulp.src(paths.globalImages + '**/*')
    .pipe(gulp.dest(paths.dist + 'images'))
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
