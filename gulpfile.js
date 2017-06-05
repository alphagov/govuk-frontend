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
const gtenon = require('gulp-tenon-client')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssnormalize = require('postcss-normalize')
const merge = require('merge-stream')

// Styles build task ---------------------
// Compiles CSS from Sass
// Output both a minified and non-minified version into /public/stylesheets/
// ---------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', 'scss:compile:ie', cb)
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
  let processors = [
    autoprefixer,
    postcssnormalize,
    cssnano
  ]
  let compileAll = gulp.src(paths.globalScss + '**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.distCss))

  let prefixScss = gulp.src(paths.src + '**/*.scss')
    .pipe(postcss([
      autoprefixer,
      require('postcss-nested')
    ], {syntax: require('postcss-scss')}))
    .pipe(gulp.dest(paths.dist))

  return merge(compileAll, prefixScss)
})

// Compile old IE compatible CSS ---------
// ---------------------------------------
gulp.task('scss:compile:ie', () => {
  let compileAllForOldIe = gulp.src(paths.distCss + '*-oldie.css')
    .pipe(
      postcss([
        require('oldie')({
          rgba: {filter: true},
          rem: {disable: true},
          unmq: {disable: true}
          // more rules go here
        })
      ])
    )
    .pipe(gulp.dest(paths.distCss))

  // oldie doesn't currently work when source is scss. author checking
  // let prefixScssIe = gulp.src(paths.src + '**/*.scss')
  //   .pipe(postcss([
  //     autoprefixer,
  //     require('oldie')({
  //       rgba: {filter: true},
  //       rem: {disable: true},
  //       unmq: {disable: true}
  //       // more rules go here
  //     }),
  //     require('postcss-nested')
  //   ], {syntax: require('postcss-scss')}))
  //   .pipe(gulp.dest(paths.dist))

  return merge(compileAllForOldIe)
})

// Scripts build tasks --------------------
// Lints, compiles javascript partials
// ---------------------------------------
gulp.task('js:compile', () => {
  return gulp.src([paths.src + '**/*.js'])
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
  gulp.watch([paths.src + 'components/**/*.html'], ['preview:components'])
})

// Dev task ------------------------------
// Compiles assets and sets up watches.
// ---------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'scripts',
              'preview:components',
              'serve',
              'watch', cb)
})

// Serve task ---------------------------
// Creates a server to preview components
// ---------------------------------------
gulp.task('serve', () => {
  const server = gls.static(paths.dist, 8888)
  server.start()
})

// Preview components --------------------
// Combines all html files in components into a single  file
// Inserts compiled component css into the head of the page
// ---------------------------------------
gulp.task('preview:components', () => {
  gulp.src(paths.src + 'index.html')
  .pipe(inject(gulp.src([paths.components + '**/*.html']), {
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

// Tests ----------------
// ---------------------------------------
gulp.task('test', cb => {
  runsequence('html:tenon',
              'js:lint',
              'scss:lint',
              cb)
})

// Check HTML using Tenon ----------------
// ---------------------------------------
gulp.task('html:tenon', function () {
  gulp.src('src/components/**/*.html', {read: false})
  .pipe(gtenon({
    key: 'fc7b85e07ea9b862c6422e412e999f3b',
    snippet: true, // include errorSnippet in the console output
    filter: [
      3,  // Ignore: language of page is not set
      31, // Ignore: link uses an invalid hypertext reference
      64, // Ignore: page has no title
      97  // Ignore: page has no headings
    ]
  }))
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
