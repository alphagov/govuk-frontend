'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const replace = require('gulp-replace')
const filter = require('gulp-filter')
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')

let scssFiles = filter([configPaths.src + '**/*.scss'], {restore: true})
let icons = filter([configPaths.src + 'globals/icons/*'], {restore: true})
let components = filter([configPaths.src + 'components/**/*'], {restore: true})
let globals = filter([configPaths.src + 'globals/scss/**/*'], {restore: true})

const isProduction = taskArguments.isProduction
const isPackages = (taskArguments.destination === 'packages') || false

gulp.task('copy-files', () => {
  return gulp.src([
    configPaths.src + '**/*',
    '!' + configPaths.src + 'components/_component-example/**/*',
    '!' + configPaths.src + 'globals/icons',
    '!' + configPaths.src + 'globals/scss',
    '!' + configPaths.src + 'globals',
    '!' + configPaths.src + 'components',
    '!' + configPaths.src + 'globals/scss/govuk-frontend-oldie.scss',
    '!' + configPaths.src + 'components/**/index.njk',
    '!' + configPaths.src + 'components/**/*.{yml,yaml}'
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
  .pipe(gulpif(isPackages, replace('../../components', '@govuk-frontend')))
  .pipe(gulpif(isPackages, replace('../../globals/scss', '@govuk-frontend/globals')))
  .pipe(gulpif(isPackages, replace('./node_modules/', '')))
  .pipe(flatten({
    subPath: [2, 3],
    newPath: 'globals'
  }))
  .pipe(gulpif(!isProduction,
    rename((path) => {
      if (path.basename + path.extname === 'govuk-frontend.scss') {
        path.dirname = 'all'
        path.basename = '_all'
      }
    })
  ))
  .pipe(globals.restore)
  .pipe(components) // replace import in scss files and flatten folder (e.g remove components/)
  .pipe(gulpif(isPackages, replace('../../globals/scss', '@govuk-frontend/globals')))
  .pipe(gulpif(isPackages, replace('../', '@govuk-frontend/')))
  .pipe(gulpif(!isProduction, flatten({subPath: [1, 3]})))
  .pipe(components.restore)
  .pipe(gulp.dest(taskArguments.destination + '/'))
})
