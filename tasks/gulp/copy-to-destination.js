'use strict'

const gulp = require('gulp')
const paths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const replace = require('gulp-replace')
const filter = require('gulp-filter')
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')

let scssFiles = filter([paths.src + '**/*.scss'], {restore: true})
let icons = filter([paths.src + 'globals/icons/*'], {restore: true})
let components = filter([paths.src + 'components/**/*'], {restore: true})
let globals = filter([paths.src + 'globals/scss/**/*'], {restore: true})

gulp.task('copy-files', () => {
  return gulp.src([
    paths.src + '**/*',
    '!' + paths.src + 'components/_component-example/**/*',
    '!' + paths.src + 'globals/icons',
    '!' + paths.src + 'globals/scss',
    '!' + paths.src + 'globals',
    '!' + paths.src + 'views',
    '!' + paths.src + 'components',
    '!' + paths.src + 'views/**',
    '!' + paths.src + 'examples',
    '!' + paths.src + 'examples/**',
    '!' + paths.src + 'globals/scss/govuk-frontend-oldie.scss'
  ])
  .pipe(scssFiles)
  .pipe(replace('//start:devonly', '/*start:devonly'))
  .pipe(replace('//end:devonly', 'end:devonly*/'))
  .pipe(postcss([
    // postcssnormalize,
    autoprefixer,
    require('postcss-nested')
  ], {syntax: require('postcss-scss')}))
  .pipe(scssFiles.restore)
  .pipe(icons)
  .pipe(flatten({includeParents: -1}))
  .pipe(icons.restore)
  .pipe(globals)  // replace import in scss files and bring globals/ up one level
  .pipe(replace('../../components', '@govuk-frontend'))
  .pipe(replace('../../globals', '@govuk-frontend'))
  .pipe(replace('./node_modules/', ''))
  .pipe(flatten({
    subPath: [2, 3],
    newPath: 'globals'
  }))
  .pipe(rename((path) => {
    if (path.basename + path.extname === 'govuk-frontend.scss') {
      path.dirname = 'all'
      path.basename = '_all'
    }
  }))
  .pipe(globals.restore)
  .pipe(components) // replace import in scss files and flatten folder (e.g remove components/)
  .pipe(replace('../../globals/scss', '@govuk-frontend/globals'))
  .pipe(replace('../', '@govuk-frontend/'))
  .pipe(flatten({includeParents: -1}))
  .pipe(components.restore)
  .pipe(gulp.dest(taskArguments.destination + '/'))
})
