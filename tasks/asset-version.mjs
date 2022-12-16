import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import { pkg } from '../config/index.js'

import { destination, isDist } from './task-arguments.mjs'

/**
 * Write VERSION.txt
 * with `package/package.json` version
 *
 * @returns {Promise<void>}
 */
export async function updateDistAssetsVersion () {
  if (!isDist) {
    throw new Error('Asset version can only be applied to ./dist')
  }

  // Write VERSION.txt file
  return writeFile(join(destination, 'VERSION.txt'), pkg.version + EOL)
}

updateDistAssetsVersion.displayName = 'update-dist-assets-version'
