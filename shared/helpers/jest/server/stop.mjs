import { teardown } from 'jest-dev-server'

// Stop web server
export default function stopServer() {
  teardown(globalThis.servers)
}
