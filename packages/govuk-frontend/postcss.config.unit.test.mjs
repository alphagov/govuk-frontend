import configFn from './postcss.config.mjs'

describe('PostCSS config', () => {
  function getPluginNames (config) {
    return config.plugins.flatMap(getPluginName)
  }

  function getPluginName ({ plugins, postcssPlugin }) {
    return plugins ? getPluginNames({ plugins }) : postcssPlugin
  }

  describe('Browserslist', () => {
    it('Uses default environment', () => {
      const config = configFn()

      expect(config.plugins)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            postcssPlugin: 'autoprefixer'
          })
        ]))
    })

    it.each([
      {
        from: 'example.scss',
        to: 'example.min.css'
      }
    ])('Uses default environment for $from', ({ from, to }) => {
      const config = configFn({ from, to })

      expect(config.plugins)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            postcssPlugin: 'autoprefixer'
          })
        ]))
    })
  })

  describe('Plugins', () => {
    describe('CSS syntax parser', () => {
      it.each([
        {
          from: 'example.scss',
          to: 'example.min.css'
        }
      ])('Adds plugins for $from', ({ from, to }) => {
        const config = configFn({ from, to })

        expect(getPluginNames(config))
          .toEqual([
            'autoprefixer',
            'govuk-frontend-version',
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
            'cssnano-util-raw-cache'
          ])
      })
    })

    describe('Sass syntax parser', () => {
      it.each([
        {
          from: 'src/govuk/components/accordion/_accordion.scss',
          to: 'dist/govuk/components/accordion/_accordion.scss'
        }
      ])('Adds plugins for $from', ({ from, to }) => {
        const config = configFn({ from, to })

        expect(getPluginNames(config))
          .toEqual([
            'autoprefixer',
            'govuk-frontend-version'
          ])
      })
    })
  })
})
