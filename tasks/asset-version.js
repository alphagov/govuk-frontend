'use strict'

const configPaths = require('../config/paths.json')
const fs = require('fs')
const path = require('path')

// Update assets' version numbers
// Uses the version number from `package/package.json` and writes it to various places
function updateDistAssetsVersion (cb) {
  const distFolder = 'dist'
  const pkg = require('../' + configPaths.package + 'package.json')

  // Write VERSION.txt file
  fs.writeFileSync(distFolder + '/VERSION.txt', pkg.version + '\r\n')

  // Files to process
  const assetFiles = [
    distFolder + '/govuk-frontend.min.css',
    distFolder + '/govuk-frontend-ie8.min.css',
    distFolder + '/govuk-frontend.min.js'
  ]

  // Loop through files and move them to their new locations
  assetFiles.map(srcFilename => {
    const destFilename = srcFilename.replace(/(govuk.*)(?=\.min)/g, '$1-' + pkg.version)
    fs.rename(
      path.resolve(srcFilename),
      path.resolve(destFilename),
      error => {
        if (error) throw error
        console.log(`Moved ${srcFilename} to ${destFilename}.`)
      }
    )
  })

  // Required for Gulp task to complete successfully.
  // Can be removed once this no longer runs via Gulp.
  cb()
}

module.exports = updateDistAssetsVersion
