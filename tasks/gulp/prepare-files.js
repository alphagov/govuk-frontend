'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const filter = require('gulp-filter')
const fileinclude = require('gulp-file-include')

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
