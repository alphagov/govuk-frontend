/**
 * Middleware
 */
const assets = require('./assets')
const docs = require('./docs')
const legacy = require('./legacy')
const request = require('./request')
const robots = require('./robots')
const vendor = require('./vendor')

module.exports = {
  assets,
  docs,
  legacy,
  request,
  robots,
  vendor
}
