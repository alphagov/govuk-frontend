const { pkg } = require('@govuk-frontend/config')

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
        'polyfill-corejs3',
        {
          // Add logging for required polyfills
          debug: isProduction,

          // Browser support polyfills to exclude
          exclude: [
            // ES2022 Error cause is unused
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
            'es.error.cause'
          ],

          // Replace unsupported code with polyfills
          method: 'usage-global',
          version: pkg.devDependencies['core-js']
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
