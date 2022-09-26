import serverStart from '../server/start.mjs'
import { setup } from 'jest-environment-puppeteer'

/**
 * Open browser
 *
 * @param {import('jest').Config} jestConfig
 */
export default async function browserOpen (jestConfig) {
  await serverStart() // Wait for web server
  await setup(jestConfig) // Open browser
}
