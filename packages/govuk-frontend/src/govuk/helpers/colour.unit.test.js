const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

describe('@function govuk-colour', () => {
  let sassBootstrap = ''

  beforeEach(() => {
    sassBootstrap = `
      $colours: (
        "blue": (
          "primary": #1d70b8,
          "tint-25": #5694ca,
        ),
        "green": (
          "primary": #11875a,
          "tint-25": #4da583,
        ),
        "red": (
          "primary": #ca3535,
          "tint-25": #d76868,
        ),
        "white": #fff
      );

      @import "helpers/colour";
    `
  })

  it('returns the variant of the colour if it exits', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour('red', 'tint-25', $colours);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
        .foo {
          color: #d76868;
        }
      `
    })
  })

  it('accepts unquoted strings', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour(red, tint-25, $colours);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
        .foo {
          color: #d76868;
        }
      `
    })
  })

  it("returns the colour if there's no variant", async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour(white, $colours: $colours);
        border-color: govuk-colour(white, any-variant, $colours);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
        .foo {
          color: #fff;
          border-color: #fff;
        }
      `
    })
  })

  describe.each([
    [
      'light-pink',
      { output: '#e59abe', alternative: '"magenta", $variant: "tint-50"' }
    ],
    [
      'pink',
      { output: '#ca357c', alternative: '"magenta", $variant: "primary"' }
    ],
    [
      'light-green',
      { output: '#4da583', alternative: '"green", $variant: "tint-25"' }
    ],
    [
      'turquoise',
      { output: '#158187', alternative: '"teal", $variant: "primary"' }
    ],
    [
      'light-blue',
      { output: '#5694ca', alternative: '"blue", $variant: "tint-25"' }
    ],
    [
      'dark-blue',
      { output: '#0f385c', alternative: '"blue", $variant: "shade-50"' }
    ],
    [
      'light-purple',
      { output: '#7f65b7', alternative: '"purple", $variant: "tint-25"' }
    ],
    [
      'bright-purple',
      { output: '#98285d', alternative: '"magenta", $variant: "shade-25"' }
    ],
    [
      'dark-grey',
      { output: '#484949', alternative: '"black", $variant: "tint-25"' }
    ],
    [
      'mid-grey',
      { output: '#cecece', alternative: '"black", $variant: "tint-80"' }
    ],
    [
      'light-grey',
      { output: '#f3f3f3', alternative: '"black", $variant: "tint-95"' }
    ]
  ])('returns the equivalent brand colour for `%s`', (colour, expected) => {
    it('returns the equivalent colour', async () => {
      const sass = `
        @import "settings/colours-palette";
        @import "helpers/colour";

        .foo {
          color: govuk-colour("#{${colour}}");
        }
      `

      await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
        css: outdent`
          .foo {
            color: ${expected.output};
          }
        `
      })
    })

    it('warns the users of the deprecation and offers alternative parameters', async () => {
      const sass = `
        @import "settings/colours-palette";
        @import "helpers/colour";

        .foo {
          color: govuk-colour("#{${colour}}");
        }
      `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      expect(mockWarnFunction).toHaveBeenCalledWith(
        `We've updated GOV.UK Frontend's colour palette. Use \`govuk-colour(${expected.alternative})\` ` +
          `instead of \`govuk-colour("${colour}")\`. The \`${colour}\` colour is deprecated ` +
          `and we'll remove it in the next major version. To silence this warning, ` +
          `update $govuk-suppressed-warnings with key: "pre-brand-colour"`,
        expect.anything()
      )
    })
  })

  describe('defaults', () => {
    it('defaults the variant to "primary"', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour(red, $colours: $colours);
        }
      `

      await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
        css: outdent`
          .foo {
            color: #ca3535;
          }
        `
      })
    })

    it('defaults the colours to $govuk-brand-colours', async () => {
      const sass = `
        @import "helpers/colour";

        .foo {
          color: govuk-colour(red, tint-25);
        }
      `

      await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
        css: outdent`
          .foo {
            color: #d76868;
          }
        `
      })
    })
  })

  describe('errors', () => {
    it('throws an error if the colour is not found', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('unknown-colour', 'tint-25', $colours);
        }
      `

      await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
        'Unknown colour `unknown-colour` (available colours: blue, green, red, white)'
      )
    })

    it('throws an error if the found colour is not a Map or Color', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('a-colour', 'tint-25', ("a-colour": "not-a-map-or-colour"));
        }
      `

      await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
        'Colour `a-colour` should either be a `map` or `color`, not a `string`'
      )
    })

    it('throws an error if the variant is not found', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', 'unknown-variant', $colours);
        }
      `

      await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
        'Unknown variant `unknown-variant` for colour `red` (available variants: primary, tint-25)'
      )
    })
  })

  describe('shorthand', () => {
    it('allows using a positional argument for the list of colours', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour(white, $colours);
        }
      `

      await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
        css: outdent`
          .foo {
            color: #ffffff;
          }
        `
      })
    })
  })
})

describe('@function govuk-organisation-colour', () => {
  const sassBootstrap = `
    $govuk-new-organisation-colours: true;
    $govuk-colours-organisations: (
      'department-of-social-affairs-citizenship': (
        colour: #EC22FF,
        contrast-safe: #9A00A8
      ),
      'department-of-administrative-affairs': (
        colour: #A81223
      ),
      'ministry-of-silly-walks': (
        colour: #786999,
        deprecation-message: 'The Ministry of Silly Walks became the Department for Silly Walks in 2007.'
      )
    );

    @import "helpers/colour";
  `

  it('returns the contrast-safe colour for a given organisation by default', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('department-of-social-affairs-citizenship');
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
        .foo {
          color: #9A00A8;
        }
      `
    })
  })

  it('falls back to the default colour if a contrast-safe colour is not explicitly defined', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('department-of-administrative-affairs');
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
        .foo {
          color: #A81223;
        }
      `
    })
  })

  it('can be overridden to return the non-contrast-safe colour', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: govuk-organisation-colour('department-of-social-affairs-citizenship', $contrast-safe: false);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            border-color: #EC22FF;
          }
        `
    })
  })

  it('outputs a warning if the organisation has been deprecated', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('ministry-of-silly-walks');
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The Ministry of Silly Walks became the Department for Silly Walks in 2007. To silence this warning, update $govuk-suppressed-warnings with key: "organisation-colours"',
      expect.anything()
    )
  })

  it('throws an error if a non-existent organisation is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('ministry-of-love');
      }
    `

    await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
      'Unknown organisation `ministry-of-love`'
    )
  })

  it('aliases renamed organisation keys to the equivalent key', async () => {
    const sass = `
      $govuk-colours-organisations: (
        'department-for-business-trade': (
          colour: #e52d13
        )
      );

      @import "helpers/colour";

      .foo {
        color: govuk-organisation-colour('department-for-business-and-trade');
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            color: #e52d13;
          }
        `
    })
  })
})

describe('@function govuk-shade', () => {
  it('outputs the colour value passed to it', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-shade(rgb(171, 205, 239), 67);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            color: rgb(171, 205, 239);
          }
        `
    })
  })

  it('outputs a warning when used', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-shade(rgb(171, 205, 239), 67);
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The govuk-shade function is deprecated. It now just returns the colour ' +
        'passed to it. Use the new GOV.UK colour palette instead. To silence ' +
        'this warning, update $govuk-suppressed-warnings with key: "govuk-shade"',
      expect.anything()
    )
  })
})

describe('@function govuk-tint', () => {
  it('outputs the colour value passed to it', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-tint(rgb(18, 52, 86), 67);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            color: rgb(18, 52, 86);
          }
        `
    })
  })

  it('outputs a warning when used', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-tint(rgb(18, 52, 86), 67);
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The govuk-tint function is deprecated. It now just returns the colour ' +
        'passed to it. Use the new GOV.UK colour palette instead. To silence ' +
        'this warning, update $govuk-suppressed-warnings with key: "govuk-tint"',
      expect.anything()
    )
  })
})
