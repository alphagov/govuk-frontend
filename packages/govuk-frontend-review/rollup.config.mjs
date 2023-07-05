import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { paths } from 'govuk-frontend-config'
import { defineConfig } from 'rollup'

/**
 * Rollup config
 * Outputs self-executing function, suitable for <script> tags
 */
export default defineConfig(({ i: input }) => ({
  input,

  /**
   * Output options
   */
  output: {
    compact: true,
    format: 'es',

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
        safari10: true
      })
    ]
  },

  /**
   * Input plugins
   */
  plugins: [
    resolve({ rootDir: paths.app })
  ]
}))
