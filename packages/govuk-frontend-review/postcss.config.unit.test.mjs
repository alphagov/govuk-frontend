import config from './postcss.config.mjs'

describe('PostCSS config', () => {
  function getPluginNames(config) {
    return config.plugins.flatMap(getPluginName)
  }

  function getPluginName({ plugins, postcssPlugin }) {
    return plugins ? getPluginNames({ plugins }) : postcssPlugin
  }

  describe('Browserslist', () => {
    it('Uses default environment', () => {
      expect(config.plugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            postcssPlugin: 'autoprefixer'
          })
        ])
      )
    })
  })

  describe('Plugins', () => {
    it('Uses expected plugins', () => {
      expect(getPluginNames(config)).toEqual([
        'autoprefixer',
        'postcss-pseudo-classes'
      ])
    })
  })
})
