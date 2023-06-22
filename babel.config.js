/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  api.cache(true)

  const presets = [
    ['@babel/preset-env', {
      exclude: [
        'transform-dynamic-import'
      ],
      targets: {
        node: 'current'
      }
    }]
  ]

  return {
    presets
  }
}
