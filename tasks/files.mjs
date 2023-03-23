import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { basename, join } from 'path'

import { deleteAsync } from 'del'
import slash from 'slash'

import { pkg } from '../config/index.js'

/**
 * Delete path globs for a given destination
 *
 * @param {string} pattern - Pattern to remove
 * @param {AssetEntry[1]} options - Asset options
 * @returns {() => Promise<string[]>} Prepared compile task
 */
export function clean (pattern, { destPath, ignore }) {
  const task = () => deleteAsync(slash(join(destPath, pattern)), { ignore })

  task.displayName = `clean:${basename(destPath)}`

  return task
}

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

// Include Gulp legacy file tasks
export { copyAssets, copyFiles } from './gulp/copy-to-destination.mjs'
export { watch } from './gulp/watch.mjs'

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
