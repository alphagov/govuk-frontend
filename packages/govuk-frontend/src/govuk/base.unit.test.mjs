import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('_base.scss', () => {
  // Keep the current behaviour of outputting custom properties with `@import`
  describe('with `@import`', () => {
    it('outputs the custom properties when imported', async () => {
      const sass = `
        @import "base";
      `

      const { css } = await compileSassString(sass)

      expect(css).toContain('--govuk-frontend-version')
      expect(css).toContain('--govuk-breakpoint-mobile')
      expect(css).toContain('--govuk-brand-colour')
    })

    it('does not output custom properties twice when imported twice', async () => {
      const sass = `
        @import "base";
        @import "base";
      `

      const { css } = await compileSassString(sass)

      const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

      expect(Array.from(occurrences)).toHaveLength(1)
    })
  })

  describe('with `@use`', () => {
    // With `@use`, base's responsibility is only to provide an API
    // to be used by layers actually outputting CSS
    it('does not output custom properties with `@use`', async () => {
      const sass = `
        @use "base";
      `

      const { css } = await compileSassString(sass)

      expect(css).not.toContain('--govuk-frontend-version')
      expect(css).not.toContain('--govuk-breakpoint-mobile')
      expect(css).not.toContain('--govuk-brand-colour')
    })

    describe('@mixin govuk-custom-properties', () => {
      it('outputs the custom properties', async () => {
        const sass = `
          @use "base";
          @include base.govuk-custom-properties;
        `

        const { css } = await compileSassString(sass)

        expect(css).toContain('--govuk-frontend-version')
        expect(css).toContain('--govuk-breakpoint-mobile')
        expect(css).toContain('--govuk-brand-colour')
      })
    })
  })
})
