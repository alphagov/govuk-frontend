const { dirname, join } = require('path')

// Repository root directory
const rootPath = dirname(__dirname)

/**
 * Config paths
 */
module.exports = {
  root: rootPath,
  src: join(rootPath, 'src'),

  // Build: Release distribution
  dist: join(rootPath, 'dist'),

  // Build: Package for npm publish
  package: join(rootPath, 'package'),

  // Review application
  app: join(rootPath, 'app'),

  // Documentation
  jsdoc: join(rootPath, 'jsdoc'),
  sassdoc: join(rootPath, 'sassdoc')
}
