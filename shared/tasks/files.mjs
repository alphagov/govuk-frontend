import { mkdir, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { dirname, join, parse } from 'path'

import cpy from 'cpy'
import { deleteAsync } from 'del'
import { pkg } from 'govuk-frontend-config'
import slash from 'slash'

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
 * Write `package/dist/package.json` version to file
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {AssetEntry[1]} options - Asset options
 */
export async function version (assetPath, options) {
  await write(assetPath, {
    ...options,

    async fileContents () {
      return pkg.version
    }
  })
}

/**
 * Write file task
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {AssetEntry[1]} options - Asset options
 */
export async function write (assetPath, { destPath, filePath, fileContents }) {
  const assetDestPath = join(destPath, filePath ? filePath(parse(assetPath)) : assetPath)

  if (!fileContents) {
    throw new Error("Option 'fileContents' required")
  }

  await mkdir(dirname(assetDestPath), { recursive: true })
  await writeFile(assetDestPath, await fileContents() + EOL)
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

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
