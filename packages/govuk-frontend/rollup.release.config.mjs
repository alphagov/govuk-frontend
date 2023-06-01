import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { pkg } from 'govuk-frontend-config'
import { componentPathToModuleName } from 'govuk-frontend-lib/names'
import { defineConfig } from 'rollup'

/**
 * Rollup config for GitHub release
 *
 * Universal Module Definition (UMD) bundle for browser <script>
 * `window` globals and compatibility with CommonJS and AMD `require()`
 */
export default defineConfig(({ i: input }) => ({
  input,

  /**
   * Output options
   */
  output: {
    format: 'umd',
    preserveModules: false,

    /**
     * Output plugins
     */
    plugins: [
      terser({
        format: { comments: false },

        // Include sources content from source maps to inspect
        // GOV.UK Frontend and other dependencies' source code
        sourceMap: {
          includeSources: true
        },

        // Compatibility workarounds
        ecma: 5,
        safari10: true
      })
    ],

    // Components are given names (e.g window.GOVUKFrontend.Accordion)
    amd: { id: componentPathToModuleName(input) },
    name: componentPathToModuleName(input)
  },

  /**
   * Input plugins
   */
  plugins: [
    replace({
      include: '**/common/govuk-frontend-version.mjs',
      preventAssignment: true,

      // Add GOV.UK Frontend release version
      development: pkg.version
    })
  ]
}))
