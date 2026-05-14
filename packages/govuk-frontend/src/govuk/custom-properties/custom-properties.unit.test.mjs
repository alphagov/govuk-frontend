import { join } from 'node:path'

import { paths } from '@govuk-frontend/config'
import {
  compileSassFile,
  compileSassString,
  getSassPathsFromLayer
} from '@govuk-frontend/helpers/tests'

const partials = getSassPathsFromLayer('core')

describe('GOV.UK Frontend custom properties', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "custom-properties";
    `
    ],
    ['use', `@use "custom-properties";`]
  ])('with `@%s`', (type, sass) => {
    let css

    beforeAll(async () => {
      css = (await compileSassString(sass)).css
    })

    it('outputs each set of custom properties', async () => {
      await expect(css).toContain('--govuk-frontend-version')
      await expect(css).toContain('--govuk-breakpoint-mobile')
      await expect(css).toContain('--govuk-brand-colour')
    })
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    let css
    beforeAll(async () => {
      const file = join(paths.package, partialPath)

      css = (await compileSassFile(file)).css
    })

    // Sass will error when trying to access an undefined variable or mixin
    // but will not on a function, so we need to check the output for calls
    // to GOV.UK Frontend's API that are not namespaced with `base.`
    it('does not contain any unexpected govuk- function calls', async () => {
      const matches = css.matchAll(/_?govuk-[\w-]+\(.*?\)/g)

      // `matchAll` does not return an actual `Array` so we need
      // a little conversion before we can check its length
      expect(Array.from(matches)).toHaveLength(0)
    })
  })
})
