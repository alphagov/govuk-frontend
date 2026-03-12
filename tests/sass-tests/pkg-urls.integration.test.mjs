import { compileStringAsync } from 'sass-embedded'

import { sassConfig } from './sass.config.js'

describe('`pkg:` URLs', () => {
  describe.each([
    ['pkg:govuk-frontend', 'node_modules/govuk-frontend/dist/govuk'],
    [
      'pkg:govuk-frontend/components/button',
      'node_modules/govuk-frontend/dist/govuk/components/button'
    ],
    [
      'pkg:govuk-frontend/dist/govuk/components/button',
      'node_modules/govuk-frontend/dist/govuk/components/button'
    ]
  ])('%s resolves to %s', (pkgUrl, fileUrl) => {
    let cssFromFileUrl

    beforeEach(async () => {
      const sass = `
        @use "${fileUrl}"
      `

      cssFromFileUrl = (await compileStringAsync(sass, sassConfig)).css
    })

    it('outputs the same CSS as the path', async () => {
      const sass = `
        @use "${pkgUrl}";
      `

      const { css } = await compileStringAsync(sass, {
        ...sassConfig,
        loadPaths: null // Prevent loadPaths from interfering
      })

      expect(css).toBe(cssFromFileUrl)
    })
  })
})
