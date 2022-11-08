const { writeFile } = require('fs/promises')
const { EOL } = require('os')
const { join } = require('path')

const { destination } = require('./task-arguments.js')

/**
 * Write GOV.UK Prototype Kit config
 *
 * @returns {Promise<void>}
 */
async function updatePrototypeKitConfig () {
  const { default: configFn } = await import('../src/govuk-prototype-kit/govuk-prototype-kit.config.mjs')

  // JSON config file path + contents
  const configPath = join(destination, 'govuk-prototype-kit.config.json')
  const configJSON = JSON.stringify(await configFn(), null, 2) + EOL

  // Write JSON config file
  return writeFile(configPath, configJSON)
}

updatePrototypeKitConfig.displayName = 'update-prototype-kit-config'

module.exports = {
  updatePrototypeKitConfig
}
