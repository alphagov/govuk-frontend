const { join } = require('path')

const { paths, urls } = require('@govuk-frontend/config')
const { packageTypeToPath } = require('@govuk-frontend/lib/names')

// Resolve GOV.UK Frontend from review app `node_modules`
// to allow previous versions to be installed locally
const frontendPath = packageTypeToPath('govuk-frontend', {
  modulePath: '/',
  moduleRoot: paths.app
})

/**
 * Browsersync config
 *
 * @satisfies {import('browser-sync').Options}
 */
module.exports = {
  proxy: urls.app,

  // Bind to localhost only by default
  ...(process.env.ALLOW_EXTERNAL_CONNECTIONS === 'true'
    ? {}
    : { listen: 'localhost' }),

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
    join(frontendPath, 'assets/**/*'),
    join(frontendPath, 'govuk-frontend.min.js'),
    join(frontendPath, '**/*.njk')
  ],
  ignore: ['**/*.test.*'],

  /**
   * Browser URL paths (e.g. `/javascripts`) are mapped to multiple
   * Browsersync watch directories and static asset middleware in:
   *
   * {@link file://./src/common/middleware/assets.mjs}
   */
  serveStatic: [
    {
      route: '/assets',
      dir: [join(frontendPath, 'assets')]
    },
    {
      route: '/javascripts',
      dir: [frontendPath, join(paths.app, 'dist/javascripts')]
    },
    {
      route: '/stylesheets',
      dir: [frontendPath, join(paths.app, 'dist/stylesheets')]
    }
  ]
}
