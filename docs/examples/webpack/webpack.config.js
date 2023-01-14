const { dirname, resolve } = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// Module resolution
const frontendPath = dirname(require.resolve('govuk-frontend'))
const html5shivPath = dirname(require.resolve('html5shiv'))
const webpackPath = dirname(require.resolve('webpack/package.json'))
const modulesPath = resolve(webpackPath, '../')

module.exports = ({ WEBPACK_SERVE }, { mode }) => ({
  devServer: {
    watchFiles: {
      paths: ['**/*.html']
    }
  },

  devtool: WEBPACK_SERVE
    ? 'inline-source-map'
    : 'source-map',

  entry: [
    './assets/javascripts/main.mjs',
    './assets/stylesheets/app.scss'
  ],

  module: {
    rules: [
      {
        test: /\.(cjs|js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward'
          }
        }
      },
      {
        generator: {
          outputPath: 'assets/stylesheets',
          publicPath: '/assets/stylesheets',
          filename: '[name].min.css'
        },
        test: /\.scss$/,
        type: 'asset',
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                quietDeps: true
              }
            }
          }
        ]
      }
    ]
  },

  optimization: {
    minimize: mode === 'production',
    minimizer: [new TerserPlugin({
      extractComments: true,
      terserOptions: {
        ecma: 5,
        format: { comments: false },
        ie8: true,
        safari10: true
      }
    })]
  },

  output: {
    clean: true,
    filename: 'assets/javascripts/[name].min.js',
    library: { type: 'umd' },
    path: resolve(__dirname, './public'),
    publicPath: '/'
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        resolve(__dirname, 'index.html'),
        {
          context: resolve(frontendPath, './assets'),
          from: '{fonts,images}/**',
          to: './assets'
        },
        {
          context: html5shivPath,
          from: 'html5shiv.min.js',
          to: './assets/javascripts'
        }
      ]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!**/{fonts,images}/**']
    })
  ],

  stats: {
    preset: 'minimal',
    errorDetails: true
  },

  resolve: { modules: [modulesPath] },
  target: ['web', 'es5']
})
