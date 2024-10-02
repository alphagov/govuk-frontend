import config from '@govuk-frontend/config'
import { babel } from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

async function getGOVUKFrontendExportsNames() {
  try {
    global.HTMLElement = /** @type {any} */ (function () {})
    global.HTMLAnchorElement = /** @type {any} */ (function () {})
    return Object.keys(await import('govuk-frontend/src/govuk/all.mjs'))
  } finally {
    delete global.HTMLElement
    delete global.HTMLAnchorElement
  }
}

/**
 * Rollup config for GitHub release
 *
 * ECMAScript (ES) module bundles for browser <script type="module">
 * or using `import` for modern browsers and Node.js scripts
 *
 * @param {import('rollup').RollupOptions} input
 * @returns {Promise<import('rollup').RollupOptions|import('rollup').RollupOptions[]>} rollup config
 */
export default async (input) => {
  const GOVUKFrontendComponents = await getGOVUKFrontendExportsNames()

  return defineConfig(({ i: input }) => ({
    input,

    /**
     * Output options
     */
    output: {
      compact: true,
      format: 'es',

      // Bundled modules
      preserveModules: false,

      /**
       * Output plugins
       */
      plugins: [
        terser({
          // Allow Terser to remove @preserve comments
          format: { comments: false },

          mangle: {
            keep_classnames: true,
            keep_fnames: true,
            // Ensure all top-level exports skip mangling, for example
            // non-function string constants like `export { version }`
            reserved: GOVUKFrontendComponents
          },

          // Include sources content from source maps to inspect
          // GOV.UK Frontend and other dependencies' source code
          sourceMap: {
            includeSources: true
          },

          // Compatibility workarounds
          safari10: true
        })
      ]
    },

    /**
     * Input plugins
     */
    plugins: [
      replace({
        include: '**/common/govuk-frontend-version.mjs',
        preventAssignment: true,

        // Add GOV.UK Frontend release version
        development: config.version
      }),
      babel({
        babelHelpers: 'bundled'
      })
    ]
  }))(input)
}
