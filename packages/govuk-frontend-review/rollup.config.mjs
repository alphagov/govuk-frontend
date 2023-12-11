import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

/**
 * Rollup config for Review app
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
        // iFrame Resizer and other dependencies' source code
        sourceMap: {
          includeSources: true
        },

        // Compatibility workarounds
        safari10: true
      })
    ]
  }
}))
