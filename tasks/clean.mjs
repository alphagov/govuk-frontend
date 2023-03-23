import { basename, join } from 'path'

import { deleteAsync } from 'del'
import slash from 'slash'

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
 * @typedef {import('./compile-assets.mjs').AssetEntry} AssetEntry
 */
