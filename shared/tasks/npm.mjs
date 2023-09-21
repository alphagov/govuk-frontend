import { paths } from '@govuk-frontend/config'
import runScript from '@npmcli/run-script'
import PluginError from 'plugin-error'

import { task } from './index.mjs'

/**
 * Spawns Node.js child process for npm script
 *
 * @param {string} name - npm script name
 * @param {string[]} [args] - npm script CLI arguments
 * @param {import('./index.mjs').TaskOptions} [options] - Task options
 * @returns {Promise<void>} Script run
 */
export async function run(name, args = [], options) {
  const pkgPath = options?.basePath ?? paths.root

  try {
    const task = await runScript({
      args,
      event: name,
      path: pkgPath,
      stdio: 'inherit'
    })

    // Throw on missing npm script
    if (!task.cmd) {
      throw new Error(`Task '${name}' not found in '${pkgPath}'`)
    }
  } catch (cause) {
    // Skip Nodemon (SIGINT) exit or aborted task error codes
    // https://github.com/open-cli-tools/concurrently/pull/359/files
    if (cause.signal === 'SIGINT' || [130, 3221225786].includes(cause.code)) {
      return
    }

    throw new PluginError(`npm run ${name}`, cause, {
      // Hide error properties already formatted by npm
      showProperties: false
    })
  }
}

/**
 * Creates a Gulp task for run()
 *
 * @param {string} name - npm script name
 * @param {string[]} [args] - npm script CLI arguments
 * @param {import('./index.mjs').TaskOptions} [options] - Task options
 * @returns {() => Promise<void>} Script run
 */
export function script(name, args = [], options) {
  let displayName = `npm run ${name}`

  if (args.length) {
    displayName = `${displayName} ${args.join(' ')}`
  }

  return task.name(displayName, () => run(name, args, options))
}
