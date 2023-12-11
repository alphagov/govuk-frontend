/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function (api) {
  const isProduction = !api.env('development')

  // Assume browser environment via Rollup plugin
  const isBrowser = api.caller(
    (caller) => caller?.name === '@rollup/plugin-babel'
  )

  // Apply Browserslist environment for supported targets
  // https://github.com/browserslist/browserslist#configuring-for-different-environments
  const browserslistEnv = isBrowser ? 'javascripts' : 'node'

  return {
    browserslistEnv,
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
        const isDocumentation = ['* @param', '* @returns', '* @typedef'].some(
          (tag) => comment.includes(tag)
        )

        // Print only public JSDoc comments
        return !isPrivate && isDocumentation
      }
    },
    plugins: [
      [
        'polyfill-es-shims',
        {
          // Add logging for required polyfills
          debug: isProduction,

          // Browser support polyfills to exclude
          exclude: [
            // ES2016 '[].includes()' sparse array fix is unnecessary
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1767541
            // https://github.com/zloirock/core-js/commit/66be5f0b673714bc7cc72a3b5e437fe277465973
            'Array.prototype.includes',

            // ES2022 Error cause is unused
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
            'Error cause'
          ],

          // Replace unsupported code with polyfills
          // without modifying window globals
          method: 'usage-pure'
        }
      ]
    ],
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
