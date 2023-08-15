const { ports } = require('@govuk-frontend/config')

/**
 * @type {import('jest-dev-server').Config}
 */
module.exports = {
  command: 'npm start --workspace govuk-frontend-review',
  port: ports.app,

  // Allow 15 seconds to start server
  launchTimeout: 15000,

  // Skip when already running
  usedPortAction: 'ignore'
}
