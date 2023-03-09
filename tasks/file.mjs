import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { basename, join } from 'path'

import { pkg } from '../config/index.js'

/**
 * Write `package/package.json` version to file
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {AssetEntry[1]} options - Asset options
 * @returns {() => Promise<void>} Prepared compile task
 */
export function version (assetPath, { destPath }) {
  const task = () => writeFile(join(destPath, assetPath), pkg.version + EOL)

  task.displayName = `file:version ${basename(assetPath)}`

  return task
}

/**
 * @typedef {import('./compile-assets.mjs').AssetEntry} AssetEntry
 */
