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

        // Apply bug fixes to avoid transforms
        bugfixes: true,

        // Apply smaller "loose" transforms for browsers
        loose: browserslistEnv === 'javascripts',

        // Transform ES modules for Node.js
        modules: browserslistEnv === 'node' ? 'auto' : false
      }]
    ]
  }
}
