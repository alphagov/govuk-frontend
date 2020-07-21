'use strict'

const nunjucks = require('nunjucks')
const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const filter = require('gulp-filter')
const fs = require('fs')
const yamlToJson = require('js-yaml')
const path = require('path')
const map = require('map-stream')
const rename = require('gulp-rename')

const scssFiles = filter([configPaths.src + '**/*.scss'], { restore: true })
const yamlFiles = filter([configPaths.components + '**/*.yaml'], { restore: true })

gulp.task('copy-files', () => {
  return gulp.src([
    configPaths.src + '**/*',
    '!**/.DS_Store',
    '!**/*.test.js',
    '!' + configPaths.src + 'README.md', // Don't override the existing README in /package
    '!' + configPaths.components + '**/__snapshots__/**',
    '!' + configPaths.components + '**/__snapshots__/'
  ])
    .pipe(scssFiles)
    .pipe(postcss([
      autoprefixer
    ], { syntax: require('postcss-scss') }))
    .pipe(scssFiles.restore)
    .pipe(yamlFiles)
    .pipe(map(function (file, done) {
      const componentName = path.dirname(file.path).split(path.sep).slice(-1).toString()
      const componentYamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
      const componentTemplatePath = path.join(configPaths.components, componentName, `template.njk`)
      let yaml
      let json
      let paramsJson
      let examplesJson

      try {
        yaml = fs.readFileSync(componentYamlPath, { encoding: 'utf8', json: true })
      } catch (e) {
        console.error('ENOENT: no such file or directory: ', componentYamlPath)
      }

      if (yaml) {
        json = yamlToJson.safeLoad(yaml)
        examplesJson = json.examples
        paramsJson = json.params

        if (examplesJson) {
          const fixturesPath = path.join(taskArguments.destination, '/govuk/components', componentName, 'fixtures.json')
          const fixtures = []

          examplesJson.forEach(function (example) {
            const fixture = {
              name: example.name,
              options: example.data,
              html: nunjucks.render(componentTemplatePath, { params: example.data }).trim()
            }

            fixtures.push(fixture)
          })

          fs.writeFileSync(fixturesPath, JSON.stringify(fixtures, null, 2))
        }

        if (paramsJson) {
          file.contents = Buffer.from(JSON.stringify(paramsJson, null, 4))
        } else {
          console.error(componentYamlPath + ' is missing "params"')
        }
      }
      done(null, file)
    }))
    .pipe(rename(path => {
      path.basename = 'macro-options'
      path.extname = '.json'
    }))
    .pipe(yamlFiles.restore)
    .pipe(gulp.dest(taskArguments.destination + '/govuk/'))
})
