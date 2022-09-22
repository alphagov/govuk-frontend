const del = require('del')
const configPaths = require('../config/paths.js')

function cleanDist () {
  return del([
    `${configPaths.dist}**/*`
  ])
}

function cleanPackage () {
  return del([
    `${configPaths.package}**`,
    `!${configPaths.package}`,
    `!${configPaths.package}package.json`,
    `!${configPaths.package}govuk-prototype-kit.config.json`,
    `!${configPaths.package}README.md`
  ])
}

function cleanPublic () {
  return del([
    `${configPaths.public}**/*`
  ])
}

module.exports = {
  cleanDist,
  cleanPackage,
  cleanPublic
}
