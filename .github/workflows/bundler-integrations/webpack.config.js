/** @type {import('webpack').Configuration} */
module.exports = {
  optimization: {
    // Configure WebPack to drop exports that are not used from the code
    // so we can disable Terser and still check what's being included
    usedExports: true,
    // Prevent minification so we can see what's going on in the built file
    minimize: false
  },
  target: 'web'
}
