const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            ie8: true,
            warnings: false
          },
          mangle: {
            ie8: true
          },
          output: {
            comments: false,
            ie8: true
          }
        }
      })
    ]
  },
  entry: './assets/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es3']
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map'
  }
}

module.exports = config
