'use strict'

// TODO explanation of what this file is for

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')
const sass = require('node-sass')
const postcss = require('postcss')
const oldie = require('oldie')({
  rgba: { filter: true },
  rem: { disable: true },
  unmq: { disable: true },
  pseudo: { disable: true }
})

const taskArguments = require('./task-arguments')
const configPaths = require('../config/paths.json')
const destination = taskArguments.destination

if (destination === "dist") {
  compileDist()
}

function compilePublic() {

}

function compileDist() {
  // Fetch package.json version to update VERSION.txt and append to filenames
  const packageJson = require('../' + configPaths.package + 'package.json')
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', packageJson.version + '\r\n')

  // Compile styles
  const stylesheet = configPaths.src + 'all.scss'

  const css = sass.renderSync({
    file: stylesheet
  });

  postcss([ autoprefixer, cssnano ]).process(css.css).then(result => {
    if (result) {
      result.warnings().forEach(warn => {
        console.warn(warn.toString())
      })

      fs.writeFile(taskArguments.destination + '/govuk-frontend-' + packageJson.version + '.min.css', result.css, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })

  // Compile old IE
  const IeStylesheet = configPaths.src + 'all-ie8.scss'

  const IeCss = sass.renderSync({
    file: IeStylesheet
  });

  postcss([ autoprefixer, cssnano, oldie]).process(IeCss.css).then(result => {
    if (result) {
      result.warnings().forEach(warn => {
        console.warn(warn.toString())
      })

      fs.writeFile(taskArguments.destination + '/govuk-frontend-ie8-' + packageJson.version + '.min.css', result.css, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

function compilePackage() {

}
