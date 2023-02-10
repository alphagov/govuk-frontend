const Vinyl = require('vinyl')

const configFn = require('./postcss.config')

describe('PostCSS config', () => {
  let env

  function getPluginNames ({ plugins }) {
    return plugins.flatMap(getPluginName)
  }

  function getPluginName ({ plugins, postcssPlugin }) {
    return plugins ? getPluginNames({ plugins }) : postcssPlugin
  }

  beforeAll(() => {
    env = 'production'
  })

  describe('Browserslist', () => {
    describe('Default environment', () => {
      it('Uses default environment', () => {
        const config = configFn({ env })

        expect(config.plugins)
          .toEqual(expect.arrayContaining([
            expect.objectContaining({
              postcssPlugin: 'autoprefixer',
              options: { env }
            })
          ]))
      })

      it.each(
        [
          { path: 'example.css' },
          { path: 'example.scss' }
        ]
      )('Uses default environment for $path', ({ path }) => {
        const input = new Vinyl({ path })
        const config = configFn({ env, file: input })

        expect(config.plugins)
          .toEqual(expect.arrayContaining([
            expect.objectContaining({
              postcssPlugin: 'autoprefixer',
              options: { env }
            })
          ]))
      })
    })

    describe('IE8 only environment', () => {
      it.each(
        [
          { path: 'example-ie8.css' },
          { path: 'example-ie8.scss' },
          { path: 'example-ie8.min.css' },
          { path: 'example-ie8.min.scss' }
        ]
      )("Uses 'oldie' environment for $path", ({ path }) => {
        const input = new Vinyl({ path })
        const config = configFn({ env, file: input })

        expect(config.plugins)
          .toEqual(expect.arrayContaining([
            expect.objectContaining({
              postcssPlugin: 'autoprefixer',
              options: { env: 'oldie' }
            })
          ]))
      })
    })
  })

  describe('Plugins', () => {
    describe('Default', () => {
      it.each(
        [
          { path: 'example.css' },
          { path: 'example.scss' }
        ]
      )('Adds plugins for $path', ({ path }) => {
        const input = new Vinyl({ path })

        // Confirm plugins for both file object and path
        for (const file of [input, input.path]) {
          const config = configFn({ env, file })

          expect(getPluginNames(config))
            .toEqual([
              'autoprefixer',
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
        }
      })
    })

    describe('Default + IE8', () => {
      it.each(
        [
          { path: 'example-ie8.css' },
          { path: 'example-ie8.scss' }
        ]
      )('Adds plugins for $path', ({ path }) => {
        const input = new Vinyl({ path })

        // Confirm plugins for both file object and path
        for (const file of [input, input.path]) {
          const config = configFn({ env, file })

          expect(getPluginNames(config))
            .toEqual([
              'autoprefixer',
              'postcss-unmq',
              'postcss-unopacity',
              'postcss-color-rgba-fallback',
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
        }
      })
    })

    describe('Review app only', () => {
      it.each(
        [
          { path: 'app/assets/scss/app.css' },
          { path: 'app/assets/scss/app-legacy.css' }
        ]
      )('Adds plugins for $path', ({ path }) => {
        const input = new Vinyl({ path })

        // Confirm plugins for both file object and path
        for (const file of [input, input.path]) {
          const config = configFn({ env, file })

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
              'cssnano-util-raw-cache'
            ])
        }
      })

      it.each(
        [
          { path: 'app/views/full-page-examples/campaign-page/styles.css' },
          { path: 'app/views/full-page-examples/search/styles.css' }
        ]
      )("Skips plugin 'pseudo-classes' for $path", ({ path }) => {
        const input = new Vinyl({ path })

        // Confirm plugin skipped for both file object and path
        for (const file of [input, input.path]) {
          const config = configFn({ env, file })

          expect(getPluginNames(config))
            .not.toContain('postcss-pseudo-classes')
        }
      })
    })

    describe('Review app only + IE8', () => {
      it.each(
        [
          { path: 'app/assets/scss/app-ie8.css' },
          { path: 'app/assets/scss/app-legacy-ie8.css' }
        ]
      )('Adds plugins for $path', ({ path }) => {
        const input = new Vinyl({ path })

        // Confirm plugins for both file object and path
        for (const file of [input, input.path]) {
          const config = configFn({ env, file })

          expect(getPluginNames(config))
            .toEqual([
              'autoprefixer',
              'postcss-pseudo-classes',
              'postcss-unmq',
              'postcss-unopacity',
              'postcss-color-rgba-fallback',
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
        }
      })
    })
  })
})
