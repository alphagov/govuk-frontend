import serverStop from '../server/stop.mjs'
import { teardown } from 'jest-environment-puppeteer'

/**
 * Close browser
 */
export default async function browserClose () {
  await Promise.all([
    serverStop(), // Stop web server
    teardown() // Close browser
  ])
}
