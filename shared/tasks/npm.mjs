import { relative } from 'path'

import runScript from '@npmcli/run-script'
import { paths } from 'govuk-frontend-config'
import PluginError from 'plugin-error'

import { isDev } from './helpers/task-arguments.mjs'
import { task } from './index.mjs'

/**
 * Spawns Node.js child process for npm script
 *
 * @param {string} name - npm script name
 * @param {string} [pkgPath] - path to npm script package.json
 * @returns {Promise<void>} Script run
 */
export async function run (name, pkgPath = paths.root) {
  try {
    await runScript({
      event: name,
      path: pkgPath,
      stdio: 'inherit'
    })
  } catch (cause) {
    const error = new Error(`Task for npm script '${name}' exit code ${cause.code}`, { cause })

    if (!isDev) {
      throw new PluginError(`npm run ${name}`, error, {
        showProperties: false,
        showStack: false
      })
    }

    console.error(error.message)
  }
}

/**
 * Creates a Gulp task for run()
 *
 * @param {string} name - npm script name
 * @param {string} [pkgPath] - path to npm script package.json
 * @returns {() => Promise<void>} Script run
 */
export function script (name, pkgPath) {
  let displayName = `npm run ${name}`

  // Log workspace directory
  if (pkgPath) {
    displayName = `${displayName} --workspace ${relative(paths.root, pkgPath)}`
  }

  return task.name(displayName, () => run(name, pkgPath))
}
