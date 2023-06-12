import autoprefixer from 'autoprefixer'

/**
 * PostCSS config
 */
export default {
  plugins: [
    // Add vendor prefixes
    autoprefixer({ env: 'stylesheets' })
  ]
}
