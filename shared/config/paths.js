const { join, resolve } = require('path')

// Repository root directory
const rootPath = resolve(__dirname, '../../')

/**
 * Config paths
 */
module.exports = {
  root: rootPath,

  // Package for npm publish
  package: join(rootPath, 'package'),

  // Review application
  app: join(rootPath, 'app')
}
