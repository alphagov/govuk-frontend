import runScript from '@npmcli/run-script'
import { paths } from 'govuk-frontend-config'
import PluginError from 'plugin-error'

import { isDev } from './helpers/task-arguments.mjs'
import { task } from './index.mjs'

/**
 * Spawns Node.js child process for npm script
 *
 * @param {string} name - npm script name
 * @param {import('./index.mjs').TaskOptions} [options] - Task options
 * @returns {Promise<void>} Script run
 */
export async function run (name, options) {
  const pkgPath = options?.basePath ?? paths.root

  try {
    const task = await runScript({
      event: name,
      path: pkgPath,
      stdio: 'inherit'
    })

    // Throw on missing npm script
    if (!task.cmd) {
      throw new Error(`Task '${name}' not found in '${pkgPath}'`)
    }
  } catch (cause) {
    const error = new Error(`Task for npm script '${name}' failed`, { cause })

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
 * @param {import('./index.mjs').TaskOptions} [options] - Task options
 * @returns {() => Promise<void>} Script run
 */
export function script (name, options) {
  return task.name(`npm run ${name}`, () => run(name, options))
}
