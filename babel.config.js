/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  api.cache(true)

  const presets = [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }]
  ]

  return {
    presets
  }
}
