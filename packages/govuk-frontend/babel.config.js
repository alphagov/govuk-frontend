/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  const isBrowser = !api.env('test')

  // Apply Browserslist environment for supported targets
  // https://github.com/browserslist/browserslist#configuring-for-different-environments
  const browserslistEnv = isBrowser ? 'javascripts' : 'node'

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          browserslistEnv,

          // Apply bug fixes to avoid transforms
          bugfixes: true,

          // Apply smaller "loose" transforms for browsers
          loose: isBrowser,

          // Skip ES module transforms for browsers
          modules: isBrowser ? false : 'auto'
        }
      ]
    ]
  }
}
