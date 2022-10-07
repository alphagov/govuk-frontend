module.exports = function (api) {
  const browserslistEnv = !api.env('test')
    ? 'production'
    : 'node'

  const presets = [
    ['@babel/preset-env', {
      browserslistEnv
    }]
  ]

  return {
    presets
  }
}
