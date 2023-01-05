import { teardown } from 'jest-environment-puppeteer'

import serverStop from '../server/stop.mjs'

/**
 * Close browser
 */
export default async function browserClose () {
  await Promise.all([
    serverStop(), // Stop web server
    teardown() // Close browser
  ])
}
