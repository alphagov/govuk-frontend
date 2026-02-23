import { paths } from '@govuk-frontend/config'
import { compileStringAsync } from 'sass-embedded'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls']
}

describe('All components', () => {
  it('works when user @imports everything', async () => {
    const sass = `
      @import "node_modules/govuk-frontend/dist/govuk";
    `

    const { css } = await compileStringAsync(sass, sassConfig)

    expect(css).toMatchSnapshot()
  })

  it('works when user @uses everything', async () => {
    const sass = `
      @use "node_modules/govuk-frontend/dist/govuk";
    `

    const { css } = await compileStringAsync(sass, sassConfig)

    expect(css).toMatchSnapshot()
  })
})
