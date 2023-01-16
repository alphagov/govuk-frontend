import { basename, join } from 'path'

import { deleteAsync } from 'del'
import slash from 'slash'

import { destination } from './task-arguments.mjs'

const cleanPath = slash(destination)

/**
 * List path globs to clean for a given destination
 *
 * @param {string} cleanPath - Destination path to clean
 * @returns {string[]} Path globs to clean
 */
export function paths (cleanPath) {
  const param = [slash(join(cleanPath, '**/*'))]

  // Preserve package files
  if (basename(cleanPath) === 'package') {
    param.push(
      `!${cleanPath}/`,
      `!${cleanPath}/package.json`,
      `!${cleanPath}/govuk-prototype-kit.config.json`,
      `!${cleanPath}/README.md`
    )
  }

  return param
}

export function clean () {
  return deleteAsync(paths(cleanPath))
}

clean.displayName = `clean:${basename(cleanPath)}`
