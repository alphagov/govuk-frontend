'use strict'

const configPath = require('../../config/paths.json')
const gulp = require('gulp')
const rename = require('gulp-rename')
const data = require('gulp-data')
const path = require('path')
const fs = require('fs')
const toMarkdown = require('gulp-to-markdown')
const gulpNunjucks = require('gulp-nunjucks')
const nunjucks = require('nunjucks')
const objectData = {}
const yaml = require('js-yaml')
const helperFunctions = require('../../lib/helper-functions.js')

// data variable to be passed to the nunjucks template
function getDataForFile (file) {
  let finalData = {}
  finalData = Object.assign(finalData, objectData)
  return finalData
}

var environment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([configPath.partials, configPath.layouts, configPath.components])
)
environment.addGlobal('isReadme', 'true')
// make the function above available as a filter for all templates
environment.addFilter('componentNameToMacroName', helperFunctions.componentNameToMacroName)

gulp.task('generate:readme', () => {
  return gulp.src([configPath.components + '**/index.njk'])
    .pipe(data(file => {
      objectData.componentName = path.dirname(file.path).split(path.sep).slice(-1).toString()
      objectData.componentPath = objectData.componentName
      try {
        let componentPath = path.join(configPath.components, objectData.componentName, `${objectData.componentName}.yaml`)
        let componentData = yaml.safeLoad(fs.readFileSync(componentPath, 'utf8'), {json: true})
        objectData.componentData = componentData
        return componentData
      } catch (e) {
        console.log('ENOENT: no such file or directory: ', file)
      }
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
