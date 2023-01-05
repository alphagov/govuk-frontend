const { dirname, join } = require('path')

// Repository root directory
const rootPath = dirname(__dirname)

/**
 * Config root paths
 */
const configPaths = {
  root: rootPath,
  src: join(rootPath, 'src'),
  config: join(rootPath, 'config'),
  node_modules: join(rootPath, 'node_modules'),

  // Build: Release distribution
  dist: join(rootPath, 'dist'),

  // Build: Package for npm publish
  package: join(rootPath, 'package'),

  // Review application
  app: join(rootPath, 'app'),
  public: join(rootPath, 'public'),

  // Documentation
  jsdoc: join(rootPath, 'jsdoc'),
  sassdoc: join(rootPath, 'sassdoc')
}

module.exports = {
  ...configPaths,

  // Source paths
  assets: join(configPaths.src, 'govuk/assets'),
  components: join(configPaths.src, 'govuk/components'),

  // Review application views
  views: join(configPaths.app, 'views'),
  examples: join(configPaths.app, 'views/examples'),
  fullPageExamples: join(configPaths.app, 'views/full-page-examples'),
  layouts: join(configPaths.app, 'views/layouts')
}
