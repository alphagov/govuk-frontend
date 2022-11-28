import { readFile, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import configPaths from '../config/paths.js'

import { destination, isDist } from './task-arguments.mjs'

/**
 * Write VERSION.txt
 * with `package/package.json` version
 *
 * @returns {Promise<void>}
 */
export async function updateDistAssetsVersion () {
  const pkg = JSON.parse(await readFile(join(configPaths.package, 'package.json'), 'utf8'))

  if (!isDist) {
    throw new Error('Asset version can only be applied to ./dist')
  }

  // Write VERSION.txt file
  return writeFile(join(destination, 'VERSION.txt'), pkg.version + EOL)
}

updateDistAssetsVersion.displayName = 'update-dist-assets-version'
