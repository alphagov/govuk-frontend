'use strict'

const fs = require('fs')
const path = require('path')

const configPaths = require('../config/paths.json')

// Generate component list from source directory, excluding anything that's not
// a directory (for example, .DS_Store files)
exports.SrcComponentList = fs.readdirSync(configPaths.src)
  .filter(file => fs.statSync(path.join(configPaths.src, file)).isDirectory())

// Filter out directories that do no correspond to components
exports.SrcFilteredComponentList = exports.SrcComponentList
  .filter(file => !['all', 'globals', 'icons'].includes(file))

// Generate list of packages
exports.PackagesComponentList = fs.readdirSync(configPaths.packages)

// List all the files for a given component in packages
//
// This helper function takes a component name and returns the corresponding
// files found in the packages folder of that component
const packagesFilesForComponent = componentName => {
  return fs.readdirSync(configPaths.packages + componentName)
}
exports.packagesFilesForComponent = packagesFilesForComponent

// List all expected files for a given component in packages
//
// This helper function takes a component name and returns the expected files
// to be found in the packages folder of that component
const expectedPackagesFilesForComponent = componentName => {
  // We don't want to include the yaml file and index.njk in dist
  let srcComponentFiles = fs.readdirSync(configPaths.src + componentName)
                        .filter(file => (
                          !file.endsWith('.test.js') &&
                          file !== componentName + '.yaml' &&
                          file !== 'index.njk'
                        ))
  // We expect the package to contain a package.json
  srcComponentFiles.push('package.json')
  // Sort the files for ease of comparison
  return srcComponentFiles.sort()
}
exports.expectedPackagesFilesForComponent = expectedPackagesFilesForComponent

// Read the contents of a file from a given path
const readFileContents = filePath => {
  return fs.readFileSync(filePath, 'utf8')
}

exports.readFileContents = readFileContents
