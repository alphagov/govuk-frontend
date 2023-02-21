import { setup } from 'jest-dev-server'

import config from '../../../jest-dev-server.config.js'

// Start web server
export default () => setup(config)
