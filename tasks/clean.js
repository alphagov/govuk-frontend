const paths = require('../config/paths.json')
const del = require('del')

function cleanDist () {
  return del([
    `${paths.dist}**/*`
  ])
}

function cleanPackage () {
  return del([
    `${paths.package}**`,
    `!${paths.package}`,
    `!${paths.package}package.json`,
    `!${paths.package}govuk-prototype-kit.config.json`,
    `!${paths.package}README.md`
  ])
}

function cleanPublic () {
  return del([
    `${paths.public}**/*`
  ])
}

module.exports = {
  cleanDist,
  cleanPackage,
  cleanPublic
}
