import { compileSassStringLikeUsers } from './helpers/sass.js'

describe('ITCSS layers', () => {
  describe.each([
    'settings',
    'tools',
    'helpers',
    'core',
    'objects',
    'components',
    'utilities',
    'overrides'
  ])('%s', (layerName) => {
    it('works when user @imports the layer', async () => {
      const sass = `
          $govuk-suppressed-warnings: ("component-scss-files");
          @import "node_modules/govuk-frontend/src/govuk/base";
          @import "node_modules/govuk-frontend/src/govuk/${layerName}";
        `

      const css = await compileSassStringLikeUsers(sass)

      expect(css).toMatchSnapshot()
    })
  })
})
