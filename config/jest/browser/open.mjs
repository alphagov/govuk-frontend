import setup from 'jest-environment-puppeteer/setup'

import { download } from '../../../tasks/browser/download.mjs'

/**
 * Open browser
 *
 * @param {import('jest').Config} jestConfig - Jest config
 * @returns {Promise<void>}
 */
export default async function browserOpen (jestConfig) {
  await download() // Download browser
  return setup(jestConfig) // Open browser, start server
}
