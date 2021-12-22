'use strict'

// TODO explanation of what this file is for

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')
const sass = require('node-sass')
const postcss = require('postcss')
const rollup = require('rollup')
const eol = require('eol')
var uglify = require("uglify-js");
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

async function compileDist() {
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

  // Compile old IE styles
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

  // Compile JS
  const js = configPaths.src + 'all.js'

  const bundle = await rollup.rollup({
    input: js,
  });

  const generatedBundle = await bundle.generate({
    // Used to set the `window` global and UMD/AMD export name
    // Component JavaScript is given a unique name to aid individual imports, e.g GOVUKFrontend.Accordion
    name: "GOVUKFrontend",
    // Legacy mode is required for IE8 support
    legacy: true,
    // UMD allows the published bundle to work in CommonJS and in the browser.
    format: 'umd'
  })

  const minifiedJs = uglify.minify(generatedBundle.code);

  const completedJs = eol.auto(minifiedJs.code)

  fs.writeFile(taskArguments.destination + '/govuk-frontend-' + packageJson.version + '.min.js', completedJs, err => {
    if (err) {
      console.error(err)
      return
    }
  })

}

function compilePackage() {

}
