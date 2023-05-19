import { join } from 'path'
import { pathToFileURL } from 'url'

import { files } from './index.mjs'

/**
 * Write config to JSON
 *
 * @param {AssetEntry[0]} modulePath - File path to config
 * @param {Pick<AssetEntry[1], "srcPath" | "destPath">} options - Asset options
 * @returns {Promise<void>}
 */
export async function compile (modulePath, options) {
  const { default: configFn } = await import(pathToFileURL(join(options.srcPath, modulePath)).toString())

  // Write to destination
  return files.write(modulePath, {
    ...options,

    // Rename with `*.json` extension
    filePath ({ dir, name }) {
      return join(dir, `${name}.json`)
    },

    // Add config as JSON (formatted)
    async fileContents () {
      return JSON.stringify(await configFn(), undefined, 2)
    }
  })
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
