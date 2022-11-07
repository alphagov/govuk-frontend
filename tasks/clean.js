const { basename, join } = require('path')
const del = require('del')
const slash = require('slash')

const { destination } = require('./task-arguments.js')
const cleanPath = slash(destination)

function paths () {
  const param = [slash(join(cleanPath, '**/*'))]

  // Preserve package files
  if (basename(cleanPath) === 'package') {
    param.push(
      `!${cleanPath}/`,
      `!${cleanPath}/package.json`,
      `!${cleanPath}/govuk-prototype-kit.config.json`,
      `!${cleanPath}/README.md`
    )
  }

  return param
}

function clean () {
  return del(paths())
}

clean.displayName = `clean:${basename(cleanPath)}`

module.exports = {
  paths,
  clean
}
