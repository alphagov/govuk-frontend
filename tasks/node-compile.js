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
const postcsspseudoclasses = require('postcss-pseudo-classes')({
  // Work around a bug in pseudo classes plugin that badly transforms
  // :not(:whatever) pseudo selectors
  blacklist: [':not(', ':disabled)', ':last-child)', ':focus)', ':active)', ':hover)']
})

const taskArguments = require('./task-arguments')
const configPaths = require('../config/paths.json')
const destination = taskArguments.destination

if (destination === "dist") {
  compileDist()
}

if (destination === "public") {
  compilePublic()
}

function compilePublic() {
  // Compile styles
  compileStyles({
    filePath: configPaths.app + 'assets/scss/app.scss',
    isDist: false
  })

  // Compile IE styles
  compileIEStyles({
    filePath: configPaths.app + 'assets/scss/app-ie8.scss',
    isDist: false
  })
}

async function compileDist() {
  // Fetch package.json version to update VERSION.txt and append to filenames
  const packageJson = require('../' + configPaths.package + 'package.json')

  // Update VERSION.txt
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', packageJson.version + '\r\n')

  // Compile styles
  compileStyles({
    filePath: configPaths.src + 'all.scss',
    isDist: true,
    version: packageJson.version
  })

  // Compile IE styles
  compileIEStyles({
    filePath: configPaths.src + 'all-ie8.scss',
    isDist: true,
    version: packageJson.version
  })

  // Compile all.js
  compileAllJS()
}

function compilePackage() {

}

function compileStyles({ filePath, isDist, version }) {
  // Compile styles
  const stylesheet = filePath

  const css = sass.renderSync({
    file: stylesheet
  });

  const postcssPlugins = isDist ? [ autoprefixer, cssnano ] : [ autoprefixer, postcsspseudoclasses ]

  postcss(postcssPlugins).process(css.css).then(result => {
    if (result) {
      result.warnings().forEach(warn => {
        console.warn(warn.toString())
      })

      const filename = isDist ? '/govuk-frontend-' + version + '.min.css' : '/app.css'

      // Create the directory if it doesn't already exist
      if (!fs.existsSync(taskArguments.destination)) {
        fs.mkdirSync(taskArguments.destination);
      }

      // Write the compiled styles to a file in the chosen directory
      fs.writeFile(taskArguments.destination + filename, result.css, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

function compileIEStyles({ filePath, isDist, version }) {
  // Compile old IE styles
  const IeStylesheet = filePath

  const IeCss = sass.renderSync({
    file: IeStylesheet
  });

  const postcssPlugins = isDist ? [ autoprefixer, cssnano, oldie] : [ autoprefixer, oldie]

  postcss(postcssPlugins).process(IeCss.css).then(result => {
    if (result) {
      result.warnings().forEach(warn => {
        console.warn(warn.toString())
      })

      const filename = isDist ? '/govuk-frontend-ie8-' + version + '.min.css' : '/app-ie8.css'

      // Create the directory if it doesn't already exist
      if (!fs.existsSync(taskArguments.destination)) {
        fs.mkdirSync(taskArguments.destination);
      }

      // Write the compiled styles to a file in the chosen directory
      fs.writeFile(taskArguments.destination + filename, result.css, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

function compileAllJS() {
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
