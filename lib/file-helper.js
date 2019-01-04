'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const configPaths = require('../config/paths.json')

const childDirectories = dir => {
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(configPaths.components, file)).isDirectory())
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

const getParamNames = (rootParams, prefix) => {
  return rootParams
    .filter(thisParam => thisParam.type !== 'nunjucks-block')
    .map(thisParam => {
      const name = [prefix, thisParam.name].filter(Boolean).join(".")

      return [
        name,
        ...(thisParam.params ? getParamNames(thisParam.params, name) : [])
      ]
    })
    .reduce((out, paramNames) => out.concat(paramNames), [])
    .sort()
}

exports.getParamNames = getParamNames

const flatten = (params, prefix) => {
  return params.map(thisParam => {
    const id = prefix ? `${prefix}.${thisParam.name}` : thisParam.name
    const { params: nestedParams, ...restOfThisParam } = thisParam

    if (nestedParams) {
      return [{id: id, ...restOfThisParam}, ...flatten(nestedParams, id)]
    } else {
      return [{id: id, ...restOfThisParam}]
    }
  }).reduce((out, params) => out.concat(params), [])
}

exports.flatten = flatten

exports.getNestedComponents = rootParams => {
  return flatten(rootParams).filter(thisParam => thisParam.isComponent)
    .map(thisParam => thisParam.id)
}
