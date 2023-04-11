
import { join } from 'path'

import { files } from './index.mjs'

/**
 * Write config to JSON
 *
 * @param {AssetEntry[0]} modulePath - File path to config
 * @param {AssetEntry[1]} options - Asset options
 * @returns {Promise<void>}
 */
export async function compile (modulePath, options) {
  const { default: configFn } = await import(join(options.srcPath, modulePath))

  // Write to destination
  return files.write(modulePath, {
    ...options,

    // Format config as JSON
    async fileContents () {
      return JSON.stringify(await configFn(), undefined, 2)
    }
  })
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
