const { ports } = require('./config/index.js')

/**
 * @type {import('jest-dev-server').JestDevServerOptions}
 */
module.exports = {
  command: 'npm start --workspace app',
  port: ports.app,

  // Skip when already running
  usedPortAction: 'ignore'
}
