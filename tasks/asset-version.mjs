import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import { pkg } from '../config/index.js'

import { destination } from './task-arguments.mjs'

/**
 * Write VERSION.txt
 * with `package/package.json` version
 *
 * @returns {Promise<void>}
 */
export async function updateAssetsVersion () {
  return writeFile(join(destination, 'VERSION.txt'), pkg.version + EOL)
}

updateAssetsVersion.displayName = 'update-assets-version'
