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
      const fixturesFile = generateFixtures(file)
      done(null, fixturesFile)
    }))
    .pipe(rename(path => {
      path.basename = 'fixtures'
      path.extname = '.json'
    }))
    .pipe(yamlFiles)
    .pipe(map(function (file, done) {
      const macroFile = generateMacroOptions(file)
      done(null, macroFile)
    }))
    .pipe(rename(path => {
      path.basename = 'macro-options'
      path.extname = '.json'
    }))
    .pipe(yamlFiles.restore)
    .pipe(gulp.dest(taskArguments.destination + '/govuk/'))
})

function generateFixtures (file) {
  const json = convertYamlToJson(file)
  const componentName = path.dirname(file.path).split(path.sep).slice(-1).toString()
  const componentTemplatePath = path.join(configPaths.components, componentName, 'template.njk')

  if (json) {
    const examplesJson = json.examples

    if (examplesJson) {
      const fixtures = {
        component: componentName,
        fixtures: []
      }

      examplesJson.forEach(function (example) {
        const fixture = {
          name: example.name,
          options: example.data,
          html: nunjucks.render(componentTemplatePath, { params: example.data }).trim(),
          hidden: Boolean(example.hidden)
        }

        fixtures.fixtures.push(fixture)
      })

      file.contents = Buffer.from(JSON.stringify(fixtures, null, 4))
      return file
    } else {
      console.error(file.path + ' is missing "examples" and/or "params"')
    }
  }
}

gulp.task('js:copy-esm', () => {
  return gulp.src([configPaths.src + '**/*.js', '!' + configPaths.src + '/**/*.test.js'])
    .pipe(map(function (file, done) {
      if (!file.path.includes('vendor')) {
        // Replace any import statements using .js to .mjs, excluding polyfills
        var fileContents = file.contents.toString();
        const importRegex = new RegExp("import.*'(.*?)'",'g');
        var matches = fileContents.matchAll(importRegex);

        for (const match of matches) {
          if (!match[0].includes('.js') && !match[0].includes('.mjs')) {
            throw new Error(`Import statement found without file extension specified
              Make sure all JavaScript imports end with a '.js' file extension

              ${match[0]}

              In file, ${file.path}`)
          }

          if (!match[0].includes('vendor')) {
            const newMatch = match[0].replace('.js\'', '.mjs\'')
            fileContents = fileContents.replace(match[0], newMatch)
          }
        }

        file.contents = Buffer.from(fileContents);
      }

      done(null, file);
    }))
    .pipe(rename(function (path) {
      if (!path.dirname.includes('vendor')) {
        path.extname = '.mjs'
      }
    }))
    .pipe(gulp.dest(taskArguments.destination + '/govuk-esm/'))
})

function generateMacroOptions (file) {
  const json = convertYamlToJson(file)
  let paramsJson

  if (json) {
    paramsJson = json.params // We only want the 'params' data from component yaml

    if (paramsJson) {
      file.contents = Buffer.from(JSON.stringify(paramsJson, null, 4))
      return file
    } else {
      console.error(file.path + ' is missing "params"')
    }
  }
}

function convertYamlToJson (file) {
  const componentName = path.dirname(file.path).split(path.sep).slice(-1).toString()
  const componentPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
  let yaml

  try {
    yaml = fs.readFileSync(componentPath, { encoding: 'utf8', json: true })
  } catch (e) {
    console.error('ENOENT: no such file or directory: ', componentPath)
  }

  if (yaml) {
    return yamlToJson.safeLoad(yaml)
  }

  return false
}
