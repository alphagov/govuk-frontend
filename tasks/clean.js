const del = require('del')

const { destination } = require('./task-arguments.js')

function paths () {
  const param = [`${destination}/**/*`]

  // Preserve package files
  if (destination === 'package') {
    param.push(
      `!${destination}/`,
      `!${destination}/package.json`,
      `!${destination}/govuk-prototype-kit.config.json`,
      `!${destination}/README.md`
    )
  }

  return param
}

function clean () {
  return del(paths())
}

clean.displayName = `clean:${destination}`

module.exports = {
  paths,
  clean
}
