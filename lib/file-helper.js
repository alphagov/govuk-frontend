'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const fm = require('front-matter')

const configPaths = require('../config/paths.json')

const childDirectories = dir => {
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
}

// Generate component list from source directory, excluding anything that's not
// a directory (for example, .DS_Store files)
exports.allComponents = childDirectories(configPaths.components)

// Read the contents of a file from a given path
const readFileContents = filePath => {
  return fs.readFileSync(filePath, 'utf8')
}

exports.readFileContents = readFileContents

const getComponentData = componentName => {
  try {
    let yamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
    return yaml.safeLoad(
      fs.readFileSync(yamlPath, 'utf8'), { json: true }
    )
  } catch (error) {
    return new Error(error)
  }
}

exports.getComponentData = getComponentData

exports.fullPageExamples = () => {
  return childDirectories(path.resolve(configPaths.fullPageExamples))
    .map(folderName => ({
      name: folderName,
      path: folderName,
      ...fm(readFileContents(path.join(configPaths.fullPageExamples, folderName, 'index.njk'))).attributes
    }))
    .sort((a, b) => (a.name > b.name) ? 1 : -1)
}
