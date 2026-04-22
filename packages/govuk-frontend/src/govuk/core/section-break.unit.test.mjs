import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('core/section-break', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core/section-break";
    `
    ],
    ['use', `@use "core/section-break";`]
  ])('with `@%s`', (type, sass) => {
    it.each([
      'govuk-section-break',
      'govuk-section-break--xl',
      'govuk-section-break--l',
      'govuk-section-break--m',
      'govuk-section-break--visible'
    ])('provides a %s placeholder', async (placeholderName) => {
      const { css } = await compileSassString(`
        ${sass};

        .selector {
          @extend %${placeholderName};
        }
      `)

      expect(css).toContain(`.selector, .${placeholderName}`)
    })
  })
})
