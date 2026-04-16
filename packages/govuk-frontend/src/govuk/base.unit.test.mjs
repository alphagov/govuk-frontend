import { compileSassString } from '@govuk-frontend/helpers/tests'
import { NodePackageImporter } from 'sass-embedded'

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

    it('allows to configure asset-url functions as strings', async () => {
      const sass = `
        @import 'pkg:@govuk-frontend/helpers/assets-urls';

        $govuk-image-url-function: 'images-url';
        $govuk-font-url-function: 'fonts-url';

        @import "base";

        :root {
          --font: #{govuk-font-url('font.woff')}
          --image: #{govuk-image-url('image.woff')}
        }
      `

      const { css } = await compileSassString(sass, {
        importers: [new NodePackageImporter()]
      })

      expect(css).toContain('--font: url("example.woff")')
      expect(css).toContain('--image: url("example.svg")')
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
  })
})
