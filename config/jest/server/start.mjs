import { getServers, setup } from 'jest-dev-server'
import waitOn from 'wait-on'
import serverStop from './stop.mjs'

import configPaths from '../../paths.js'
const { PORT = configPaths.ports.test } = process.env

/**
 * Start web server
 */
export default async function serverStart () {
  const servers = await getServers()

  // Server start timeout
  let timeout = 1000

  // Server stopping?
  if (servers.some(({ signalCode }) => signalCode === 'SIGTERM')) {
    await serverStop() // Wait for server to stop
    timeout = 0 // No need to wait for start
  }

  // Wait until ready check
  const ready = ({ timeout = 30000 } = {}) => waitOn({
    resources: [`tcp:${PORT}`],
    timeout
  })

  // Wait until ready (or start up)
  try {
    await ready({ timeout })
  } catch (error) {
    await setup({
      // Ensure PORT works (on Windows) + SIGINT/SIGTERM signal events
      command: `cross-env-shell PORT=${PORT} node app/start.js`,
      port: PORT
    })
    await ready()
  }
}
