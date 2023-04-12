const { ports } = require('govuk-frontend-config')

/**
 * @type {import('jest-dev-server').Config}
 */
module.exports = {
  // Start with `--ignore-scripts` to prevent "prestart" build
  command: 'npm start --ignore-scripts --workspace app',
  port: ports.app,

  // Skip when already running
  usedPortAction: 'ignore'
}
