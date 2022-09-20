import { getServers, setup } from 'jest-dev-server'
import waitOn from 'wait-on'

import configPaths from '../../paths.js'
const { PORT = configPaths.ports.test } = process.env

/**
 * Start web server
 */
export default async function serverStart () {
  const [server] = await getServers()

  // Server already running
  if (server) {
    return
  }

  // Wait until ready
  const ready = ({ timeout = 30000 } = {}) => waitOn({
    resources: [`tcp:${PORT}`],
    timeout
  })

  // Start server
  try {
    await ready({ timeout: 1000 })
  } catch (error) {
    await setup({ command: `PORT=${PORT} node app/start.js`, port: PORT })
    await ready()
  }
}
