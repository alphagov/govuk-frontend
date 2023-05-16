import config from './postcss.config.mjs'

describe('PostCSS config', () => {
  function getPluginNames (config) {
    return config.plugins.flatMap(getPluginName)
  }

  function getPluginName ({ plugins, postcssPlugin }) {
    return plugins ? getPluginNames({ plugins }) : postcssPlugin
  }

  describe('Browserslist', () => {
    it('Uses default environment', () => {
      expect(config.plugins)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            postcssPlugin: 'autoprefixer'
          })
        ]))
    })
  })

  describe('Plugins', () => {
    it('Uses expected plugins', () => {
      expect(getPluginNames(config))
        .toEqual([
          'autoprefixer',
          'postcss-pseudo-classes',
          'postcss-discard-comments',
          'postcss-minify-gradients',
          'postcss-reduce-initial',
          'postcss-svgo',
          'postcss-normalize-display-values',
          'postcss-reduce-transforms',
          'postcss-colormin',
          'postcss-normalize-timing-functions',
          'postcss-calc',
          'postcss-convert-values',
          'postcss-ordered-values',
          'postcss-minify-selectors',
          'postcss-minify-params',
          'postcss-normalize-charset',
          'postcss-discard-overridden',
          'postcss-normalize-string',
          'postcss-normalize-unicode',
          'postcss-minify-font-values',
          'postcss-normalize-url',
          'postcss-normalize-repeat-style',
          'postcss-normalize-positions',
          'postcss-normalize-whitespace',
          'postcss-merge-longhand',
          'postcss-discard-duplicates',
          'postcss-merge-rules',
          'postcss-discard-empty',
          'postcss-unique-selectors',
          'css-declaration-sorter',
          'cssnano-util-raw-cache'
        ])
    })
  })
})
