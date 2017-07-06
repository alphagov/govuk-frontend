'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const filter = require('gulp-filter')
const fileinclude = require('gulp-file-include')
const flatten = require('gulp-flatten')
const replace = require('gulp-replace')

// Copy to temp ----------------------------
// Copies to temp/ & autoprefix scss
// -----------------------------------------
gulp.task('prepare:files', () => {
  let scssFiles = filter([paths.src + '**/*.scss'], {restore: true})
  let readmeFiles = filter([paths.src + '**/*.md'], {restore: true})
  let icons = filter([paths.src + 'globals/icons/*'], {restore: true})
  return gulp.src([paths.src + '**/*', '!' + paths.src + 'components/_component-example/**/*', '!' + paths.src + 'globals/icons'])
    .pipe(scssFiles)
    .pipe(replace('//start:devonly', '/*start:devonly'))
    .pipe(replace('//end:devonly', 'end:devonly*/'))
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
    .pipe(icons)
    .pipe(flatten({includeParents: -1}))
    .pipe(icons.restore)
    .pipe(gulp.dest(paths.tmp))
})
