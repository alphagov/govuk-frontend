import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import { destination } from './task-arguments.mjs'

/**
 * Write GOV.UK Prototype Kit config
 *
 * @returns {Promise<void>}
 */
export async function updatePrototypeKitConfig () {
  const { default: configFn } = await import('../src/govuk-prototype-kit/govuk-prototype-kit.config.mjs')

  // JSON config file path + contents
  const configPath = join(destination, 'govuk-prototype-kit.config.json')
  const configJSON = JSON.stringify(await configFn(), null, 2) + EOL

  // Write JSON config file
  return writeFile(configPath, configJSON)
}

updatePrototypeKitConfig.displayName = 'update-prototype-kit-config'
