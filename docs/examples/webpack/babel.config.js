/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  const browserslistEnv = !api.env('test')
    ? 'javascripts'
    : 'node'

  return {
    presets: [
      ['@babel/preset-env', {
        browserslistEnv,
        loose: browserslistEnv !== 'node',

        // Transform ES modules for Node.js
        modules: browserslistEnv === 'node' ? 'auto' : false
      }]
    ]
  }
}
