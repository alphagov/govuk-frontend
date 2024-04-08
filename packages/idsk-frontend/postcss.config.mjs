import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import cssnanoPresetDefault from 'cssnano-preset-default'
import postcss from 'postcss'
import scss from 'postcss-scss'

/**
 * PostCSS config
 *
 * @param {import('postcss-load-config').ConfigContext} [ctx] - Context options
 * @returns {import('postcss-load-config').Config} PostCSS Config
 */
export default ({ to = '' } = {}) => ({
  plugins: [
    // Add vendor prefixes
    autoprefixer({ env: 'stylesheets' }),

    // Add GOV.UK Frontend release version
    {
      postcssPlugin: 'govuk-frontend-version',
      Declaration: {
        // Find CSS declaration for version, update value
        // https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md
        // https://postcss.org/api/#declaration
        '--govuk-frontend-version': async (decl) => {
          const config = await import('@govuk-frontend/config')
          decl.value = `"${config.version}"`
        }
      }
    },

    // Always minify CSS
    to.endsWith('.css') &&
      cssnano({
        preset: cssnanoPresetDefault({
          env: 'stylesheets',

          // Sorted CSS is smaller when gzipped, but we sort using Stylelint
          // https://cssnano.co/docs/optimisations/cssdeclarationsorter/
          cssDeclarationSorter: false
        })
      })
  ],

  // Sass syntax support
  syntax: to.endsWith('.scss') ? scss : postcss
})
