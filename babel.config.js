/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  // Assume browser environment via Rollup plugin
  const isBrowser = api.caller(
    (caller) => caller?.name === '@rollup/plugin-babel'
  )

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
        const isPrivate = ['* @internal', '* @private'].some((tag) =>
          comment.includes(tag)
        )

        // Flag any JSDoc comments worth keeping
        const isDocumentation = [
          '* @param',
          '* @returns',
          '* @typedef',
          '* @import'
        ].some((tag) => comment.includes(tag))

        // Print only public JSDoc comments
        return !isPrivate && isDocumentation
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
