const { dirname, join } = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// Module resolution
const frontendPath = dirname(require.resolve('govuk-frontend/package.json'))

// Build paths
const srcPath = join(__dirname, 'src')
const destPath = join(__dirname, 'dist')

/**
 * @type {() => import('webpack-dev-server').WebpackConfiguration}
 */
module.exports = ({ WEBPACK_SERVE }, { mode }) => ({
  devServer: {
    watchFiles: {
      paths: ['**/*.html']
    },
    static: {
      directory: destPath
    }
  },

  devtool: WEBPACK_SERVE
    ? 'inline-source-map'
    : 'source-map',

  entry: [
    join(srcPath, 'assets/javascripts/main.mjs'),
    join(srcPath, 'assets/stylesheets/app.scss')
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
                includePaths: [frontendPath],
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
        format: { comments: false },

        // Compatibility workarounds
        ecma: 5,
        safari10: true
      }
    })]
  },

  output: {
    clean: true,
    filename: 'assets/javascripts/[name].min.js',
    library: { type: 'umd' },
    path: destPath,
    publicPath: '/'
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        join(srcPath, 'index.html'),
        {
          context: join(frontendPath, './govuk/assets'),
          from: '{fonts,images}/**',
          to: 'assets'
        }
      ]
    })
  ],

  stats: {
    preset: 'minimal',
    errorDetails: true
  },

  target: ['web', 'es5']
})
