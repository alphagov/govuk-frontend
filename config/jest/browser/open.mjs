import { setup } from 'jest-environment-puppeteer'

import { download } from '../../../tasks/browser/download.mjs'
import serverStart from '../server/start.mjs'

/**
 * Open browser
 *
 * @param {import('jest').Config} jestConfig - Jest config
 */
export default async function browserOpen (jestConfig) {
  await download() // Download browser
  await serverStart() // Wait for web server
  await setup(jestConfig) // Open browser
}
