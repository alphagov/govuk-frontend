const { ports } = require('./config/index.js')

const PORT = process.env.PORT || ports.test

/**
 * @type {import('jest-dev-server').JestDevServerOptions}
 */
module.exports = {
  // Ensure PORT works (on Windows) + SIGINT/SIGTERM signal events
  command: `cross-env-shell PORT=${PORT} node app/start.js`,
  port: PORT,

  // Skip when already running
  usedPortAction: 'ignore'
}
