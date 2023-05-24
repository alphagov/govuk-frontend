const { ports } = require('govuk-frontend-config')

/**
 * Browsersync config
 *
 * @type {import('browser-sync').Options}
 */
module.exports = {
  proxy: `http://localhost:${ports.app}`,

  // Prevent browser mirroring
  ghostMode: false,

  // Prevent browser opening
  open: false
}
