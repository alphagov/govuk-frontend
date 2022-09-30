import { teardown } from 'jest-dev-server'

/**
 * Stop web server
 */
export default async function serverStop () {
  await teardown()
}
