'use strict'

const paths = require('../../config/paths.json')
const gulp = require('gulp')
const nunjucksRender = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const data = require('gulp-data')
const tap = require('gulp-tap')
const path = require('path')
const fs = require('fs')
const vinylInfo = {}

function getDataForFile (file) {
  let finalData = {}
  finalData = Object.assign(finalData, vinylInfo)
  return finalData
}

const manageEnvironment = function (environment) {
  environment.addGlobal('isReadme', 'true')
  environment.opts.lstripBlocks = true
  environment.opts.trimBlocks = true
}

gulp.task('generate:readme', () => {
  return gulp.src(['!' + paths.components + '_component-example/index.njk', paths.components + '**/index.njk'])
  .pipe(tap(file => {
    vinylInfo.componentName = path.dirname(file.path).split(path.sep).pop()
    vinylInfo.componentPath = vinylInfo.componentName
    vinylInfo.componentNunjucksFile = fs.readFileSync(paths.components + vinylInfo.componentName + '/' + vinylInfo.componentName + '.njk', 'utf8')
    vinylInfo.componentHtmlFile = vinylInfo.componentNunjucksFile
  }))
  .pipe(data(getDataForFile))
  .pipe(nunjucksRender({
    path: [paths.src + 'views', paths.components],
    manageEnv: manageEnvironment
  }))
  .pipe(rename(function (path) {
    path.basename = 'README'
    path.extname = '.md'
  }))
  .pipe(gulp.dest(paths.src + 'components/'))
})
