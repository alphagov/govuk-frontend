const TerserPlugin = require('terser-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  // Enable production mode for Webpack, as tree-shaking is a combination of
  // - `usedExports` including, but not exporting code `export`s that are not used
  // - `TerserPlugin` clearing unused code, effectively clearing the unused exports
  //
  // More details: https://webpack.js.org/guides/tree-shaking/
  // (especially the end of 'Add a Utility', and 'Minify the Output')
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          // Reproduce Webpack's defaults
          // https://webpack.js.org/configuration/optimization/#optimizationminimizer
          compress: {
            passes: 2
          }
        }
      })
    ]
  },
  target: 'web',
  entry: {
    'single-component': './src/single-component.mjs',
    initAll: './src/initAll.mjs'
  },
  output: {
    filename: '[name].js'
  }
}
