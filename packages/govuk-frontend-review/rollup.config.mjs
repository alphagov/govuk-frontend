import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
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
    format: 'iife',
    preserveModules: false
  },

  /**
   * Input plugins
   */
  plugins: [
    // Enable import from `node_modules`
    resolve(),

    // Terser minifier plugin
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
  ]
}))
