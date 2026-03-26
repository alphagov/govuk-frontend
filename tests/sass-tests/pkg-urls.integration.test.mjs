import { compileSassStringLikeUsers, sassConfig } from './helpers/sass.js'

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

      cssFromFileUrl = await compileSassStringLikeUsers(sass)
    })

    it('outputs the same CSS as the path', async () => {
      const sass = `
        @use "${pkgUrl}";
      `

      const css = await compileSassStringLikeUsers(sass, {
        ...sassConfig,
        loadPaths: null // Prevent loadPaths from interfering
      })

      expect(css).toBe(cssFromFileUrl)
    })
  })
})
