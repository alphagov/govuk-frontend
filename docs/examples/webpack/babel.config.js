/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  // Assume browser environment via webpack 'web' target
  const isBrowser = api.caller((caller) => caller?.target === 'web')

  // Apply Browserslist environment for supported targets
  // https://github.com/browserslist/browserslist#configuring-for-different-environments
  const browserslistEnv = isBrowser ? 'javascripts' : 'node'

  return {
    browserslistEnv,
    presets: [
      [
        '@babel/preset-env',
        {
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
