/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  api.cache.forever()

  return {
    browserslistEnv: 'node',
    presets: ['@babel/preset-env']
  }
}
