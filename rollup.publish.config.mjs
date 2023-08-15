import { pkg } from '@govuk-frontend/config'
import { babel } from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { componentPathToModuleName } from 'govuk-frontend-lib/names'
import { defineConfig } from 'rollup'

/**
 * Rollup config for npm publish
 */
export default defineConfig(({ i: input }) => ({
  input,

  /**
   * Output options
   */
  output: [
    /**
     * ECMAScript (ES) modules for Node.js or bundler `import`
     */
    {
      entryFileNames: '[name].mjs',
      format: 'es',

      // Separate modules, not bundled
      preserveModules: true
    },

    /**
     * ECMAScript (ES) module bundles for browser <script type="module">
     * or using `import` for modern browsers and Node.js scripts
     */
    {
      format: 'es',

      // Bundled modules
      preserveModules: false
    },

    /**
     * Universal Module Definition (UMD) bundle for browser <script>
     * `window` globals and compatibility with CommonJS and AMD `require()`
     */
    {
      format: 'umd',

      // Bundled modules
      preserveModules: false,

      // Components are given names (e.g window.GOVUKFrontend.Accordion)
      amd: { id: componentPathToModuleName(input) },
      name: componentPathToModuleName(input)
    }
  ],

  /**
   * Input plugins
   */
  plugins: [
    replace({
      include: '**/common/govuk-frontend-version.mjs',
      preventAssignment: true,

      // Add GOV.UK Frontend release version
      development: pkg.version
    }),
    babel({
      babelHelpers: 'bundled'
    })
  ]
}))
