import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import cssnanoPresetDefault from 'cssnano-preset-default'
import postcssCustomProperties from 'postcss-custom-properties'
import pseudoclasses from 'postcss-pseudo-classes'

/**
 * PostCSS config
 *
 * @type {import('postcss-load-config').Config}
 */
export default {
  plugins: [
    // Add vendor prefixes
    autoprefixer({ env: 'stylesheets' }),
    // Custom properties for old browsers
    postcssCustomProperties(),
    // Add review app auto-generated 'companion' classes for each pseudo-class
    // For example ':hover' and ':focus' classes to simulate form label states
    pseudoclasses({
      allCombinations: true,
      restrictTo: [':link', ':visited', ':hover', ':active', ':focus']
    }),

    // Always minify CSS
    cssnano({
      preset: cssnanoPresetDefault({
        env: 'stylesheets'
      })
    })
  ]
}
