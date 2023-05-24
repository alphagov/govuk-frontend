const { join } = require('path')

const { paths, ports } = require('govuk-frontend-config')
const { packageNameToPath } = require('govuk-frontend-lib/names')

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
    join(paths.app, 'dist/javascripts/**/*.mjs'),
    join(paths.app, 'dist/stylesheets/**/*.css'),
    join(paths.app, 'src/views/**/*.njk'),
    packageNameToPath('govuk-frontend', 'dist/govuk/**/*.njk')
  ],
  ignore: ['**/*.test.*'],

  // Browser paths to files being watched
  serveStatic: [
    {
      route: '/javascripts',
      dir: join(paths.app, 'dist/javascripts')
    },
    {
      route: '/stylesheets',
      dir: join(paths.app, 'dist/stylesheets')
    }
  ]
}
