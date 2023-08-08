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
    generatorOpts: {
      shouldPrintComment(comment) {
        if (!isBrowser || comment.includes('* @preserve')) {
          return true
        }

        // Assume all comments are public unless
        // tagged with `@private` or `@internal`
        return ['* @internal', '* @private'].every(
          (tag) => !comment.includes(tag)
        )
      }
    },
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
