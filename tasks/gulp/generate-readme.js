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
const objectData = {}
const yaml = require('js-yaml')

// data variable to be passed to the nunjucks template
function getDataForFile (file) {
  let finalData = {}
  finalData = Object.assign(finalData, objectData)
  return finalData
}

var environment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([configPath.src + 'views', configPath.components])
)
environment.addGlobal('isReadme', 'true')

gulp.task('generate:readme', () => {
  return gulp.src(['!' + configPath.components + '_component-example/index.njk', configPath.components + '**/index.njk'])
  .pipe(vinylPaths(paths => {
    objectData.componentName = paths.split(path.sep).slice(-2, -1)[0]
    objectData.componentPath = objectData.componentName
    objectData.componentNunjucksFile = fs.readFileSync(configPath.components + objectData.componentName + '/' + objectData.componentName + '.njk', 'utf8')

    // we want to show all variants' code and macros on the component details page
    let componentData = yaml.safeLoad(fs.readFileSync(`src/components/${objectData.componentName}/${objectData.componentName}.yaml`, 'utf8'), {json: true})
    objectData.componentData = componentData
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
  .pipe(rename(path => {
    path.basename = 'README'
    path.extname = '.md'
  }))
  .pipe(gulp.dest(configPath.components))
})
