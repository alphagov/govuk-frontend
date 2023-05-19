import replace from '@rollup/plugin-replace'
import { pkg } from 'govuk-frontend-config'
import { defineConfig } from 'rollup'

/**
 * Rollup config for npm publish
 *
 * ECMAScript Modules (ESM) for browser <script type="module">
 * or using `import` for modern browsers and Node.js scripts
 */
export default defineConfig(({ i: input }) => ({
  input,

  /**
   * Output options
   */
  output: {
    entryFileNames: '[name].mjs',
    format: 'es',
    preserveModules: true
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
