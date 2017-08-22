'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const eol = require('gulp-eol')
const nunjucksRender = require('gulp-nunjucks-render')
const merge = require('merge-stream')
const wrap = require('gulp-wrap')
const rename = require('gulp-rename')

// Compile numnjucks ----------------------
// Convert nunjucks to HTML
// -------------------------------------------
gulp.task('nunjucks', cb => {
  let components = gulp.src(['!' + paths.components + '**/macro.njk', '!' + paths.components + '**/template.njk', paths.components + '**/*.njk'])
    .pipe(nunjucksRender({
      path: [paths.components],
      watch: true
    }))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(eol())
    .pipe(gulp.dest(paths.preview + 'components/'))

  let tempComponents = gulp.src(['!' + paths.components + '**/macro.njk', '!' + paths.components + '**/template.njk', paths.components + '**/*.njk'])
      .pipe(nunjucksRender({
        path: [paths.components],
        envOptions: {
          trimBlocks: true
        }
      }))
      .pipe(rename(function (path) {
        path.basename += '-example'
      }))
      .pipe(gulp.dest(paths.src + 'components/'))

  let examples = gulp.src(['!' + paths.components + '**/*.njk', paths.src + '**/*.njk'])
    .pipe(nunjucksRender({
      path: [paths.components],
      watch: true
    }))
    .pipe(wrap({src: paths.src + 'component-view-template.html'}))
    .pipe(eol())
    .pipe(gulp.dest(paths.preview))

  return merge(components, tempComponents, examples)
})
