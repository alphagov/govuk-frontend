import { teardown } from 'jest-environment-puppeteer'

/**
 * Close browser
 */
export default async function browserClose () {
  await teardown() // Close browser, stop server
}
