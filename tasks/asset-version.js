const configPaths = require('../config/paths.js')
const { rename, writeFile } = require('fs/promises')
const { basename, resolve } = require('path')

// Update assets' version numbers
// Uses the version number from `package/package.json` and writes it to various places
async function updateDistAssetsVersion () {
  const distFolder = 'dist'

  const pkg = require('../' + configPaths.package + 'package.json')

  // Files to process
  const assetFiles = [
    resolve(`${distFolder}/govuk-frontend.min.css`),
    resolve(`${distFolder}/govuk-frontend-ie8.min.css`),
    resolve(`${distFolder}/govuk-frontend.min.js`)
  ]

  // Loop through files
  const assetTasks = assetFiles.map(srcFilename => {
    const destFilename = srcFilename.replace(/(govuk.*)(?=\.min)/g, '$1-' + pkg.version)

    // Move to new location
    return rename(srcFilename, destFilename)
      .then(() => console.log(`Moved ${basename(srcFilename)} to ${basename(destFilename)}.`))
  })

  // Write VERSION.txt file
  assetTasks.push(writeFile(resolve(`${distFolder}/VERSION.txt`), pkg.version + '\r\n'))

  // Resolve on completion
  return Promise.all(assetTasks)
}

module.exports = updateDistAssetsVersion
