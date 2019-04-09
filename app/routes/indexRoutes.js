const express = require('express')
const indexRouter = express.Router()
const configPaths = require('../../config/paths.json')
const fileHelper = require('../../lib/file-helper')
const util = require('util')
const path = require('path')
const fs = require('fs')
const readdir = util.promisify(fs.readdir)

indexRouter.get('/', async (req, res) => {
  const components = fileHelper.allComponents
  const examples = await readdir(path.resolve(configPaths.examples))
  const fullPageExamples = await readdir(path.resolve(configPaths.fullPageExamples))

  res.render('index', {
    componentsDirectory: components,
    examplesDirectory: examples,
    fullPageExamplesDirectory: fullPageExamples
  })
})

module.exports = indexRouter
