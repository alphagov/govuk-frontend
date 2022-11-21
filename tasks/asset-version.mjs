import { readFile, rename, writeFile } from 'fs/promises'
import { basename, join } from 'path'
import { EOL } from 'os'

import configPaths from '../config/paths.js'
import { destination, isDist } from './task-arguments.mjs'

// Update assets' version numbers
// Uses the version number from `package/package.json` and writes it to various places
export async function updateDistAssetsVersion () {
  const pkg = JSON.parse(await readFile(join(configPaths.package, 'package.json'), 'utf8'))

  if (!isDist) {
    throw new Error('Asset versions can only be applied to ./dist')
  }

  // Files to process
  const assetFiles = [
    join(destination, 'govuk-frontend.min.css'),
    join(destination, 'govuk-frontend-ie8.min.css'),
    join(destination, 'govuk-frontend.min.js')
  ]

  // Loop through files
  const assetTasks = assetFiles.map(srcFilename => {
    const destFilename = srcFilename.replace(/(govuk.*)(?=\.min)/g, '$1-' + pkg.version)

    // Move to new location
    return rename(srcFilename, destFilename)
      .then(() => console.log(`Moved ${basename(srcFilename)} to ${basename(destFilename)}.`))
  })

  // Write VERSION.txt file
  assetTasks.push(writeFile(join(destination, 'VERSION.txt'), pkg.version + EOL))

  // Resolve on completion
  return Promise.all(assetTasks)
}

updateDistAssetsVersion.displayName = 'update-dist-assets-version'
