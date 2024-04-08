import config from '@govuk-frontend/config'
import { babel } from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import * as GOVUKFrontend from 'govuk-frontend/src/govuk/all.mjs'
import { defineConfig } from 'rollup'

/**
 * Rollup config for GitHub release
 *
 * ECMAScript (ES) module bundles for browser <script type="module">
 * or using `import` for modern browsers and Node.js scripts
 */
export default defineConfig(({ i: input }) => ({
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
          reserved: Object.keys(GOVUKFrontend)
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
}))
