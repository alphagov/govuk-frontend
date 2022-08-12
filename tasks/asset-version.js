'use strict'

const configPaths = require('../config/paths.json')
const fs = require('fs')
const path = require('path')
const taskArguments = require('./task-arguments')

// check for the flag passed by the task
const isDist = taskArguments.destination === 'dist' || false

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
function updateAssetsVersion (cb) {
  const pkg = require('../' + configPaths.package + 'package.json')

  // Write VERSION.txt file
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', pkg.version + '\r\n')

  // Files to process
  const assetFiles = [
    taskArguments.destination + '/govuk-frontend.min.css',
    taskArguments.destination + '/govuk-frontend-ie8.min.css',
    taskArguments.destination + '/govuk-frontend.min.js'
  ]

  // Loop through files and move them to their new locations
  assetFiles.map(srcFilename => {
    let destFilename = srcFilename
    if (isDist) {
      // If this is going to dist/, rename the file to append the version number
      destFilename = srcFilename.replace(/(govuk.*)(?=\.min)/g, '$1-' + pkg.version)
    }
    fs.rename(
      path.resolve(srcFilename),
      path.resolve(destFilename),
      error => {
        if (error) throw error
        console.log(`Moved ${srcFilename} to ${destFilename}.`)
      }
    )
  })

  // Required for Gulp task to complete
  // Can be removed once this no longer runs via Gulp
  cb()
}

module.exports = updateAssetsVersion
