const { compileSassString } = require('@govuk-frontend/helpers/tests')

describe('@mixin govuk-link-decoration', () => {
  it('sets text-decoration-thickness', async () => {
    const sass = `
      @use "settings" with (
        $govuk-link-underline-thickness: 1px
      );
      @use "helpers/links" as *;

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
      @use "settings" with (
        $govuk-link-underline-offset: .1em
      );
      @use "helpers/links" as *;

      .foo {
        @include govuk-link-decoration;
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining('text-underline-offset: 0.1em;')
    })
  })

  describe('when $govuk-link-underline-thickness is falsy', () => {
    it('does not set text-decoration-thickness', async () => {
      const sass = `
        @use "settings" with (
          $govuk-link-underline-thickness: false
        );
        @use "helpers/links" as *;

        .foo {
          @include govuk-link-decoration;
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: expect.not.stringContaining('text-decoration-thickness')
      })
    })
  })

  describe('when $govuk-link-underline-offset is falsy', () => {
    it('does not set text-decoration-offset', async () => {
      const sass = `
      @use "settings" with (
        $govuk-link-underline-offset: false
      );
      @use "helpers/links" as *;

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

describe('@mixin govuk-link-hover-decoration', () => {
  it('sets a hover state', async () => {
    const sass = `
      @use "helpers/links" as *;

      .foo:hover {
        @include govuk-link-hover-decoration;
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining('.foo:hover')
    })
  })

  describe('when $govuk-link-hover-underline-thickness is falsy', () => {
    it('does not set a hover state', async () => {
      const sass = `
      @use "settings" with (
        $govuk-link-hover-underline-thickness: false
      );
      @use "helpers/links" as *;

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
