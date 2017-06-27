'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const sasslint = require('gulp-sass-lint')
const sass = require('gulp-sass')
const runsequence = require('run-sequence')
const gls = require('gulp-live-server')
const inject = require('gulp-inject')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const standard = require('gulp-standard')
const gtenon = require('gulp-tenon-client')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssnormalize = require('postcss-normalize')
const merge = require('merge-stream')
const replace = require('gulp-replace')
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')
const filter = require('gulp-filter')
const marked = require('gulp-marked')
const path = require('path')
const fileinclude = require('gulp-file-include')
const wrap = require('gulp-wrap')
const naturalSort = require('gulp-natural-sort')

// Build packages task --------------
// ready for publishing with Lerna
// ----------------------------------
gulp.task('build:packages', cb => {
  runsequence('test', 'prepare:files', 'update:packages', cb)
})

gulp.task('build:dist', cb => {
  runsequence('prepare:dist', 'dist:compile:docs', cb)
})

// Copy files to dist ---------------
// create minified verisons as well
// ----------------------------------
gulp.task('prepare:dist', () => {
  let pkg = require('./' + paths.packages + 'all/package.json')
  let fs = require('fs')
  fs.writeFileSync(paths.dist + 'VERSION.txt', pkg.version)

  let copy = gulp.src([
    paths.tmp + '**/*',
    '!' + paths.tmp + 'component-list-template.html',
    '!' + paths.tmp + 'component-view-template.html'
  ])
    .pipe(gulp.dest(paths.dist))

  let scss = gulp.src(paths.tmp + 'globals/scss/govuk-frontend.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      postcssnormalize,
      autoprefixer,
      cssnano
    ]))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.dist + 'css/'))

  let legacyScss = gulp.src(paths.tmp + 'globals/scss/govuk-frontend-oldie.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        postcssnormalize,
        autoprefixer,
        cssnano,
        require('oldie')({
          rgba: {filter: true},
          rem: {disable: true},
          unmq: {disable: true}
          // more rules go here
        })
      ])
    )
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.dist + 'css/'))

  let js = gulp.src([paths.tmp + '**/*.js'])
      .pipe(concat('govuk-frontend.js', {newLine: '\n;'}))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(paths.dist + 'js/'))

  let listComponents = gulp.src(paths.tmp + 'component-list-template.html')
    .pipe(inject(gulp.src([paths.tmp + '/components/**/*.html'])
    .pipe(naturalSort()), {
      starttag: '<!-- inject:componentlinks -->',
      transform: function (filepath, file, i, length) {
        return '<li class="component-link"><a href="components/' + path.basename(file.path, '.html') + '/index.html">' + getName(file) + '</a></li>'
      },
      ignorePath: paths.tmp,
      removeTags: true
    }))
    .pipe(rename({
      basename: 'index'
    }))
    .pipe(replace('.css', '.min.css'))
    .pipe(replace('.js', '.min.js'))
    .pipe(gulp.dest(paths.dist))

  return merge(scss, legacyScss, js, listComponents, copy)
})

// Compile docs in dist -------------
// ----------------------------------
gulp.task('dist:compile:docs', cb => {
  return gulp.src([paths.distComponents + '**/*.md'])
    .pipe(marked({}))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(rename(path => {
      path.basename = 'index'
    }))
    .pipe(replace('.css', '.min.css'))
    .pipe(replace('.js', '.min.js'))
    .pipe(gulp.dest(paths.distComponents))
})

// Copy files to dist ---------------
// create minified verisons as well
// --------------------------------------
gulp.task('build:demo', () => {
  let pkg = require('./' + paths.packages + 'all/package.json')
  let assets = filter([paths.dist + '**/*.css', paths.dist + '**/*.js'], {restore: true})
  let copy = gulp.src([
    paths.dist + '/**/*',
    '!' + paths.dist + 'components/**/*.scss',
    '!' + paths.dist + 'components/**/*.md',
    '!' + paths.dist + 'components/**/*.html',
    '!' + paths.dist + 'components/**/*.js'
  ])
  .pipe(replace('.min.css', pkg.version + '.min.css'))
  .pipe(replace('.min.js', pkg.version + '.min.js'))
  .pipe(assets)
  .pipe(rename(obj => {
    obj.basename = obj.basename.replace(/.min$/, '')
    return obj
  }))
  .pipe(rename({
    suffix: pkg.version + '.min'
  }))
  .pipe(assets.restore)
  .pipe(gulp.dest(paths.demo))

  let copyIndex = gulp.src([
    paths.dist + 'components/**/index.html'
  ])
  .pipe(replace('.min.css', pkg.version + '.min.css'))
  .pipe(replace('.min.js', pkg.version + '.min.js'))
  .pipe(gulp.dest(paths.demo + 'components/'))

  let original = gulp.src([paths.dist + 'components/**/*.html', '!' + paths.dist + '/components/**/index.html'])
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(replace('.css', pkg.version + '.min.css'))
    .pipe(replace('.js', pkg.version + '.min.js'))
    .pipe(gulp.dest(paths.demo + 'components/'))

  let copyImages = gulp.src(paths.dist + 'globals/images/**/*')
    .pipe(gulp.dest(paths.demo + 'images/'))

  return merge(copy, copyIndex, original, copyImages)
})

// Copy to temp ----------------------------
// Copies to temp/ & autoprefix scss
// -----------------------------------------
gulp.task('prepare:files', () => {
  let scssFiles = filter([paths.src + '**/*.scss'], {restore: true})
  let readmeFiles = filter([paths.src + '**/*.md'], {restore: true})
  return gulp.src([paths.src + '**/*', '!' + paths.src + 'components/_component-example/**/*'])
    .pipe(scssFiles)
    .pipe(postcss([
      // postcssnormalize,
      autoprefixer,
      require('postcss-nested')
    ], {syntax: require('postcss-scss')}))
    .pipe(scssFiles.restore)
    .pipe(readmeFiles)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(readmeFiles.restore)
    .pipe(gulp.dest(paths.tmp))
})

// Copy files to packages ---------------
// Replace strings in readme and import
// --------------------------------------
gulp.task('update:packages', () => {
  let readmeComponents = filter([paths.tmp + 'components/**/*.md'], {restore: true})

  let components = gulp.src([paths.tmp + 'components/**/*'])
    .pipe(replace('../../globals/scss', '@govuk-frontend/globals'))
    .pipe(replace('../', '@govuk-frontend/'))
    .pipe(readmeComponents)
    .pipe(replace('<!--', ''))
    .pipe(replace('-->', ''))
    .pipe(replace(/---(.|\n)*---/g, ''))
    .pipe(readmeComponents.restore)
    .pipe(flatten({includeParents: -1}))
    .pipe(gulp.dest(paths.packages))

  let readmeGlobals = filter([paths.tmp + 'globals/**/*.md'], {restore: true})

  let globals = gulp.src([
    paths.tmp + 'globals/scss/**/*',
    '!' + paths.tmp + 'globals/scss/govuk-frontend.scss',
    '!' + paths.tmp + 'globals/scss/govuk-frontend-oldie.scss'
  ])
    .pipe(replace('../../components', '@govuk-frontend'))
    .pipe(readmeGlobals)
    .pipe(replace('<!--', ''))
    .pipe(replace('-->', ''))
    .pipe(readmeGlobals.restore)
    .pipe(flatten({
      newPath: 'globals',
      includeParents: -1
    }))
    .pipe(gulp.dest(paths.packages))

  return merge(components, globals)
})

// Preview components --------------------
// Inserts links to all components html
// Inserts compiled component css into the head of the page
// ---------------------------------------
const getName = file => {
  let name = path.basename(file.path).slice(0, -path.extname(file.path).length).replace(/^_/g, '')
  return name[0].toUpperCase() + name.substring(1)
}

gulp.task('list:components', () => {
  gulp.src(paths.src + 'component-list-template.html')
  .pipe(inject(gulp.src([paths.components + '**/*.html', '!' + paths.components + '_component-example/*.html'])
  .pipe(naturalSort()), {
    starttag: '<!-- inject:componentlinks -->',
    transform: function (filepath, file, i, length) {
      return '<li class="component-link"><a href="components/' + path.basename(file.path, '.html') + '/index.html">' + getName(file) + '</a></li>'
    },
    ignorePath: paths.components,
    removeTags: true
  }))
  .pipe(rename({
    basename: 'index'
  }))
  .pipe(gulp.dest(paths.preview))
  gulp.start('copy:images')
})

// Dev task ------------------------------
// Compiles assets and sets up watches.
// ---------------------------------------
gulp.task('dev', cb => {
  runsequence('styles',
              'scripts',
              'preview:compile:docs',
              'list:components',
              'serve:preview',
              'watch', cb)
})

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => {
  gulp.watch([paths.src + '**/**/*.scss'], ['styles'])
  gulp.watch([paths.src + '**/**/*.js'], ['scripts'])
  gulp.watch([paths.src + 'components/**/*.html'], ['list:components'])
  gulp.watch([paths.src + 'components/**/*.md'], ['preview:compile:docs'])
})

// Umbrrella scripts tasks for preview --
// --------------------------------------
gulp.task('scripts', cb => {
  runsequence('js:lint', 'js:compile', cb)
})

// Umbrrella styles tasks for preview ---
// --------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// Compile SCSS task for preview -------
// --------------------------------------
gulp.task('scss:compile', () => {
  let compile = gulp.src(paths.globalScss + 'govuk-frontend.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer
    ]))
    .pipe(gulp.dest(paths.preview + 'css/'))

  let compileOldIe = gulp.src(paths.globalScss + 'govuk-frontend-oldie.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        autoprefixer,
        require('oldie')({
          rgba: {filter: true},
          rem: {disable: true},
          unmq: {disable: true}
          // more rules go here
        })
      ])
    )
    .pipe(gulp.dest(paths.preview + 'css/'))

  return merge(compile, compileOldIe)
})

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  return gulp.src([paths.src + '**/*.js'])
    .pipe(concat('govuk-frontend.js'))
    .pipe(gulp.dest(paths.preview + 'js/'))
})

// Copy images task for preview ---------
// --------------------------------------
gulp.task('copy:images', () => {
  return gulp.src(paths.globalImages + '**/*')
    .pipe(gulp.dest(paths.preview + 'images/'))
})

gulp.task('preview:compile:docs', () => {
  let original = gulp.src([paths.components + '**/*.html'])
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(gulp.dest(paths.preview + 'components/'))

  let compiled = gulp.src([paths.components + '**/*.md'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(marked({}))
    .pipe(rename(path => {
      path.basename = 'index'
    }))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(gulp.dest(paths.preview + 'components/'))

  return merge(original, compiled)
})

// All test combined ---------------------
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
    key: '3786b3b4504cc501066c48285f80fcd3',
    snippet: true, // include errorSnippet in the console output
    filter: [
      3,  // Ignore: language of page is not set
      31, // Ignore: link uses an invalid hypertext reference
      64, // Ignore: page has no title
      97  // Ignore: page has no headings
    ]
  }))
})

// Javascript lint check -----------------
// ---------------------------------------
gulp.task('js:lint', () => {
  return gulp.src([paths.components + '**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

// Scss lint check -----------------------
// ---------------------------------------
gulp.task('scss:lint', () => {
  return gulp.src(paths.src + '**/*.scss')
    .pipe(sasslint({
      configFile: paths.config + '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})

// Serve task ---------------------------
// Creates a server to preview components
// ---------------------------------------
gulp.task('serve:preview', () => {
  const server = gls.static(paths.preview, 9999)
  server.start()
})

// Serve demo task -----------------------
// Creates a server to demo components
// ---------------------------------------
gulp.task('serve:demo', () => {
  const server = gls.static(paths.demo, 8888)
  server.start()
})

gulp.task('review', () => {
  runsequence('styles',
              'scripts',
              'preview:compile:docs',
              'list:components')
})

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------
gulp.task('default', taskListing)
