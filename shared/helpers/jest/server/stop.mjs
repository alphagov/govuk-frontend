import { teardown } from 'jest-dev-server'

// Stop web server
export default () => teardown(globalThis.servers)
