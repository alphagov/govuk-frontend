const { copyFile, mkdir, writeFile } = require('fs/promises')
const { EOL } = require('os')
const { dirname, join } = require('path')
const { cwd } = require('process')

const { destination } = require('./task-arguments.js')

/**
 * Write GOV.UK Prototype Kit config
 *
 * @returns {Promise<void>}
 */
async function updatePrototypeKitConfig () {
  const { default: configFn } = await import('../src/govuk-prototype-kit/govuk-prototype-kit.config.mjs')

  // Files to copy
  const copyFiles = [
    join('govuk-prototype-kit', 'init.js'),
    join('govuk-prototype-kit', 'init.scss')
  ]

  // Copy files to destination
  const configTasks = copyFiles.map(async (file) => {
    const fileSource = join(cwd(), 'src', file)
    const fileTarget = join(cwd(), destination, file)

    // Create destination directory
    await mkdir(dirname(fileTarget), { recursive: true })

    // Copy file to destination
    return copyFile(fileSource, fileTarget)
  })

  // JSON config file path + contents
  const configPath = join(destination, 'govuk-prototype-kit.config.json')
  const configJSON = JSON.stringify(await configFn(), null, 2) + EOL

  // Write JSON config file
  configTasks.push(writeFile(configPath, configJSON))

  // Resolve on completion
  return Promise.all(configTasks)
}

updatePrototypeKitConfig.displayName = 'update-prototype-kit-config'

module.exports = {
  updatePrototypeKitConfig
}
