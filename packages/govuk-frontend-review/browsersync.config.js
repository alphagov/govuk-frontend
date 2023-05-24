const { join } = require('path')

const { paths, ports } = require('govuk-frontend-config')

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
  open: false,

  // Allow for Express.js restart
  reloadDelay: 1000,

  // Files to watch for auto reload
  files: [
    join(paths.app, 'dist/javascripts/**/*.mjs')
  ],
  ignore: ['**/*.test.*'],

  // Browser paths to files being watched
  serveStatic: [
    {
      route: '/javascripts',
      dir: join(paths.app, 'dist/javascripts')
    }
  ]
}
