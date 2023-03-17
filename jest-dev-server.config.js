const { ports } = require('./config/index.js')

/**
 * @type {import('jest-dev-server').Config}
 */
module.exports = {
  command: 'npm start --workspace app',
  port: ports.app,

  // Skip when already running
  usedPortAction: 'ignore'
}
