const Vinyl = require('vinyl')
const configFn = require('./postcss.config.js')

describe('PostCSS config', () => {
  let env

  function getPluginNames ({ plugins }) {
    return plugins.map(({ postcssPlugin }) => postcssPlugin)
  }

  beforeAll(() => {
    env = 'production'
  })

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
          .toEqual(['autoprefixer'])
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
            'oldie'
          ])
      }
    })
  })

  describe('Default + Minification', () => {
    it.each(
      [
        { path: 'example.min.css' },
        { path: 'example.min.scss' }
      ]
    )('Adds plugins for $path', ({ path }) => {
      const input = new Vinyl({ path })

      // Confirm plugins for both file object and path
      for (const file of [input, input.path]) {
        const config = configFn({ env, file })

        expect(getPluginNames(config))
          .toEqual([
            'autoprefixer',
            'cssnano'
          ])
      }
    })
  })

  describe('Default + Minification + IE8', () => {
    it.each(
      [
        { path: 'example-ie8.min.css' },
        { path: 'example-ie8.min.scss' }
      ]
    )('Adds plugins for $path', ({ path }) => {
      const input = new Vinyl({ path })

      // Confirm plugins for both file object and path
      for (const file of [input, input.path]) {
        const config = configFn({ env, file })

        expect(getPluginNames(config))
          .toEqual([
            'autoprefixer',
            'cssnano',
            'oldie'
          ])
      }
    })
  })

  describe('Review app only', () => {
    it.each(
      [
        { path: 'app/assets/scss/app.scss' },
        { path: 'app/assets/scss/app-legacy.scss' }
      ]
    )('Adds plugins for $path', ({ path }) => {
      const input = new Vinyl({ path })

      // Confirm plugins for both file object and path
      for (const file of [input, input.path]) {
        const config = configFn({ env, file })

        expect(getPluginNames(config))
          .toEqual([
            'autoprefixer',
            'postcss-pseudo-classes'
          ])
      }
    })
  })

  describe('Review app only + IE8', () => {
    it.each(
      [
        { path: 'app/assets/scss/app-ie8.scss' },
        { path: 'app/assets/scss/app-legacy-ie8.scss' }
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
            'oldie'
          ])
      }
    })
  })
})
