const path = require('path')
const configPaths = require('./paths.json')

const OUTPUT = process.env.OUTPUT || 'public'
const outputPath = configPaths.output.js[OUTPUT]

console.log(`Webpack will build output to ${outputPath}`)

const config = {
  mode: 'production',
  devtool: 'source-map',
  entry: configPaths.entry.js,
  output: {
    // output path (e.g. packages)
    path: path.resolve(__dirname, '..', outputPath),
    filename: '[name]/[name].js', // For example, button/button.js
    library: 'govuk-frontend',
    libraryTarget: 'umd',
    umdNamedDefine: true, // Allows RequireJS to reference `govuk-frontend`
    sourceMapFilename: '[name]/[name].js.map'
  }
}

module.exports = config
