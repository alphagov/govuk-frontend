'use strict'

const fs = require('fs')
const util = require('util')
const configPaths = require('../config/paths.json')

// Read component list from various sources
exports.SrcComponentList = fs.readdirSync(configPaths.src + 'components/')
exports.DistComponentList = fs.readdirSync(configPaths.dist + 'components/')
exports.PackagesComponentList = fs.readdirSync(configPaths.packages)

// List all the files for a given component in dist/components
//
// This helper function takes a component name and returns the corresponding
// files found in the dist/components folder of that component
const distFilesForComponent = componentName => {
  return fs.readdirSync(configPaths.dist + 'components/' + componentName)
}
exports.distFilesForComponent = distFilesForComponent

// List all expected files for a given component in dist/components
//
// This helper function takes a component name and returns the expected files
// to be found in the dist/components folder of that component
const expectedDistFilesForComponent = componentName => {
  // We don't want to include the yaml file and index.njk in dist
  let srcComponentFiles = fs.readdirSync(configPaths.src + 'components/' + componentName)
                        .filter(file => (file !== componentName + '.yaml' && file !== 'index.njk'))
  // We expect dist to contain an html sample
  srcComponentFiles.push(componentName + '.html')
  // Sort the files for ease of comparison
  return srcComponentFiles.sort()
}
exports.expectedDistFilesForComponent = expectedDistFilesForComponent

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
  let srcComponentFiles = fs.readdirSync(configPaths.src + 'components/' + componentName)
                        .filter(file => (file !== componentName + '.yaml' && file !== 'index.njk'))
  // We expect the package to contain a package.json and an html sample
  srcComponentFiles.push('package.json')
  srcComponentFiles.push(componentName + '.html')
  // Sort the files for ease of comparison
  return srcComponentFiles.sort()
}
exports.expectedPackagesFilesForComponent = expectedPackagesFilesForComponent

// Read the contents of a file from a given path
const readFile = util.promisify(fs.readFile)
async function readFileContents (filePath) {
  const content = await readFile(filePath, 'utf-8')
  console.log(content)
  return content
}

exports.readFileContents = readFileContents
