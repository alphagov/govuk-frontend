import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

import configFn from './rollup.umd.config.mjs'

/**
 * Rollup config for GitHub release
 *
 * Universal Module Definition (UMD) bundle for browser <script>
 * `window` globals and compatibility with CommonJS and AMD `require()`
 */
export default defineConfig((args) => {
  const config = configFn(args)

  // Add Terser minifier plugin
  if ('plugins' in config && Array.isArray(config.plugins)) {
    config.plugins.push(
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
    )
  }

  return config
})
