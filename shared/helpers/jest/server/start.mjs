import { setup } from 'jest-dev-server'

import config from '../../../../jest-dev-server.config.js'

// Start web server(s)
export default async function startServer() {
  globalThis.servers = await setup(config)
}
