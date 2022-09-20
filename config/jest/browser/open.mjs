import serverStart from '../server/start.mjs'
import { setup } from 'jest-environment-puppeteer'

/**
 * Open browser
 */
export default async function browserOpen () {
  await serverStart() // Wait for web server
  await setup() // Open browser
}
