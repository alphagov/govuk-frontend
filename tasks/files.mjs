import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import cpy from 'cpy'
import { deleteAsync } from 'del'
import slash from 'slash'

import { pkg } from '../config/index.js'

/**
 * Delete path globs for a given destination
 *
 * @param {string} pattern - Pattern to remove
 * @param {AssetEntry[1]} options - Asset options
 */
export async function clean (pattern, { destPath, ignore }) {
  await deleteAsync(slash(join(destPath, pattern)), { ignore })
}

/**
 * Write `package/package.json` version to file
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {AssetEntry[1]} options - Asset options
 */
export async function version (assetPath, { destPath }) {
  await writeFile(join(destPath, assetPath), pkg.version + EOL)
}

/**
 * Copy files task
 * Copies files to destination
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} options - Asset options
 */
export async function copy (pattern, { srcPath, destPath, ignore = [] }) {
  const srcPatterns = [slash(join(srcPath, pattern))]
    .concat(ignore.map((pattern) => `!${pattern}`))

  await cpy(srcPatterns, destPath, { cwd: srcPath })
}

// Include Gulp legacy file tasks
export { generateFixtures, generateMacroOptions } from './gulp/copy-to-destination.mjs'

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
