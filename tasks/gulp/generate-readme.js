'use strict'

const configPath = require('../../config/paths.json')
const gulp = require('gulp')
const rename = require('gulp-rename')
const data = require('gulp-data')
const vinylPaths = require('vinyl-paths')
const path = require('path')
const fs = require('fs')
const toMarkdown = require('gulp-to-markdown')
const gulpNunjucks = require('gulp-nunjucks')
const nunjucks = require('nunjucks')
const vinylInfo = {}

function getDataForFile (file) {
  let finalData = {}
  finalData = Object.assign(finalData, vinylInfo)
  return finalData
}

var environment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([configPath.src + 'views', configPath.components])
)
environment.addGlobal('isReadme', 'true')

gulp.task('generate:readme', () => {
  return gulp.src(['!' + configPath.components + '_component-example/index.njk', configPath.components + '**/index.njk'])
  .pipe(vinylPaths(paths => {
    vinylInfo.componentName = paths.split(path.sep).slice(-2, -1)[0]
    vinylInfo.componentPath = vinylInfo.componentName
    vinylInfo.componentNunjucksFile = fs.readFileSync(configPath.components + vinylInfo.componentName + '/' + vinylInfo.componentName + '.njk', 'utf8')

    let variantItems = []
    let files = fs.readdirSync(configPath.components + vinylInfo.componentName + '/')
    files.forEach(file => {
      if (file.indexOf('.njk') > -1 && file.indexOf('--') > -1) {
        let njk = fs.readFileSync('src/components/' + vinylInfo.componentName + '/' + file, 'utf8')
        let name = file
        let html = fs.readFileSync('public/components/' + vinylInfo.componentName + '/' + vinylInfo.componentName + '.html', 'utf8')
        variantItems.push({
          njk: njk,
          name: name,
          html: html
        })
      }
    })
    vinylInfo.variantItems = variantItems
    return Promise.resolve()
  }))
  .pipe(data(getDataForFile))
  .pipe(gulpNunjucks.compile('', {
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    env: environment
  }))
  .pipe(toMarkdown({
    gfm: true // github flavoured markdown https://github.com/domchristie/to-markdown#gfm-boolean
  }))
  .pipe(rename(function (path) {
    path.basename = 'README'
    path.extname = '.md'
  }))
  .pipe(gulp.dest(configPath.src + 'components/'))
})
