import runScript from '@npmcli/run-script'
import PluginError from 'plugin-error'

import { paths } from '../config/index.js'

import { isDev } from './helpers/task-arguments.mjs'

/**
 * Spawns Node.js child process for npm script
 * rather than using Gulp
 *
 * @param {string} name - npm script name
 * @param {string} [pkgPath] - path to npm script package.json
 * @returns {Promise<void>} Script run
 */
export async function script (name, pkgPath = paths.root) {
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
 * Creates a Gulp task for script()
 *
 * @param {string} name - npm script name
 * @param {string} [pkgPath] - path to npm script package.json
 * @returns {() => Promise<void>} Script run
 */
export function run (name, pkgPath) {
  const task = () => script(name, pkgPath)

  // Add task alias
  // https://gulpjs.com/docs/en/api/task#task-metadata
  task.displayName = `npm run ${name}`

  return task
}
