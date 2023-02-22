import { setup } from 'jest-environment-puppeteer'

import { download } from '../../../tasks/browser/download.mjs'

/**
 * Open browser
 *
 * @param {import('jest').Config} jestConfig - Jest config
 */
export default async function browserOpen (jestConfig) {
  const { maxWorkers } = jestConfig

  /**
   * Increase Node.js max listeners warning threshold by Jest --maxWorkers
   * Allows jest-puppeteer.config.js `browserPerWorker: true` to open multiple browsers
   */
  if (Number.isFinite(maxWorkers)) {
    process.setMaxListeners(1 + maxWorkers)
  }

  await download() // Download browser
  return setup(jestConfig) // Open browser, start server
}
