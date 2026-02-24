import { paths } from '@govuk-frontend/config'
import { compileStringAsync } from 'sass-embedded'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls']
}

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
          @import "node_modules/govuk-frontend/dist/govuk/base";
          @import "node_modules/govuk-frontend/dist/govuk/${layerName}";
        `

      const { css } = await compileStringAsync(sass, sassConfig)

      expect(css).toMatchSnapshot()
    })
  })
})
