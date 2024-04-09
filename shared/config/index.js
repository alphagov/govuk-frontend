// eslint-disable-next-line n/no-extraneous-require
const pkg = require('idsk-frontend/package.json')

// Node.js environment with default
// https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production
const { NODE_ENV = 'development' } = process.env

/**
 * Config
 */
const paths = require('./paths')
const ports = require('./ports')
const urls = require('./urls')

/**
 * GOV.UK Frontend release version
 *
 * The version export identifies development builds using NODE_ENV by default
 * unlike test and production builds which use the release pkg.version number
 */
const version = ['test', 'production'].includes(NODE_ENV)
  ? pkg.version // Use release version
  : NODE_ENV // or default to build type

module.exports = {
  paths,
  pkg,
  ports,
  urls,
  version
}
