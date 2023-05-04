const { compileSassString } = require('govuk-frontend-helpers/tests')

describe('@mixin govuk-link-decoration', () => {
  describe('by default', () => {
    it('does not set text-decoration-thickness', async () => {
      const sass = `
        @import "base";

        .foo {
          @include govuk-link-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.not.stringContaining('text-decoration-thickness')
      })
    })

    it('does not set text-underline-offset', async () => {
      const sass = `
        @import "base";

        .foo {
          @include govuk-link-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.not.stringContaining('text-underline-offset')
      })
    })
  })

  describe('when $govuk-new-link-styles are enabled', () => {
    it('sets text-decoration-thickness', async () => {
      const sass = `
        $govuk-new-link-styles: true;
        $govuk-link-underline-thickness: 1px;
        @import "base";

        .foo {
          @include govuk-link-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.stringContaining('text-decoration-thickness: 1px;')
      })
    })

    it('sets text-underline-offset', async () => {
      const sass = `
        $govuk-new-link-styles: true;
        $govuk-link-underline-offset: .1em;
        @import "base";

        .foo {
          @include govuk-link-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.stringContaining('text-underline-offset: 0.1em;')
      })
    })

    describe('when $govuk-link-underline-thickness is falsey', () => {
      it('does not set text-decoration-thickness', async () => {
        const sass = `
          $govuk-new-link-styles: true;
          $govuk-link-underline-thickness: false;
          @import "base";

          .foo {
            @include govuk-link-decoration;
          }
        `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: expect.not.stringContaining('text-decoration-thickness')
        })
      })
    })

    describe('when $govuk-link-underline-offset is falsey', () => {
      it('does not set text-decoration-offset ', async () => {
        const sass = `
        $govuk-new-link-styles: true;
        $govuk-link-underline-offset: false;
        @import "base";

        .foo {
            @include govuk-link-decoration;
        }
      `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: expect.not.stringContaining('text-underline-offset')
        })
      })
    })
  })
})

describe('@mixin govuk-link-hover-decoration', () => {
  describe('by default', () => {
    it('does not set a hover state', async () => {
      const sass = `
      @import "base";

      // The mixin shouldn't return anything, so this selector ends up empty and
      // is omitted from the CSS
      .foo:hover {
          @include govuk-link-hover-decoration;
      }
    `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.not.stringContaining('.foo:hover')
      })
    })
  })

  describe('when $govuk-new-link-styles are enabled', () => {
    it('sets a hover state', async () => {
      const sass = `
        $govuk-new-link-styles: true;
        $govuk-link-hover-underline-thickness: 10px;
        @import "base";

        .foo:hover {
          @include govuk-link-hover-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.stringContaining('.foo:hover')
      })
    })

    describe('when $govuk-link-hover-underline-thickness is falsey', () => {
      it('does not set a hover state', async () => {
        const sass = `
        $govuk-new-link-styles: true;
        $govuk-link-hover-underline-thickness: false;
        @import "base";

        // The mixin shouldn't return anything, so this selector ends up empty and
        // is omitted from the CSS
        .foo:hover {
            @include govuk-link-hover-decoration;
        }
      `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: expect.not.stringContaining('.foo:hover')
        })
      })
    })
  })
})

describe('@mixin govuk-link-style-text', () => {
  describe('when $govuk-text-colour is a colour', () => {
    it('applies the rgba function', async () => {
      const sass = `
        $govuk-text-colour: black;
        @import "base";

        a {
            @include govuk-link-style-text;
        }
      `

      const results = compileSassString(sass)

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining(':hover')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('color:')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('rgba(')
      })
    })
  })

  describe('when $govuk-text-colour is inherit', () => {
    it('does NOT apply the rgba function', async () => {
      const sass = `
        $govuk-text-colour: inherit;
        @import "base";

        a {
            @include govuk-link-style-text;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.not.stringContaining('rgba(')
      })
    })
  })
})
