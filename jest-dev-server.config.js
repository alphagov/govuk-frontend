const { ports } = require('govuk-frontend-config')

/**
 * @type {import('jest-dev-server').Config}
 */
module.exports = {
  command: 'npm start --workspace packages/govuk-frontend-review',
  port: ports.app,

  // Skip when already running
  usedPortAction: 'ignore'
}
