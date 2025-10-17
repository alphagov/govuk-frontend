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
      $govuk-colours: (
        "red": #ff0000,
        "green": #00ff00,
        "blue": #0000ff
      );

      @import "helpers/colour";
    `
  })

  it('returns a colour from the colour palette', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour('red');
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

  it('works with unquoted strings', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour(red);
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

  it('throws an error if a non-existent colour is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour('hooloovoo');
      }
    `

    await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
      'Unknown colour `hooloovoo`'
    )
  })

  it('throws a deprecation warning if the $legacy parameter is used', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-colour('red', $legacy: 'blue');
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The `$legacy` parameter of `govuk-colour` is deprecated and is ' +
        'non-operational. It will be removed in the next major version. To ' +
        'silence this warning, update $govuk-suppressed-warnings with key: ' +
        '"legacy-colour-param"',
      expect.anything()
    )
  })
})

describe('@function govuk-organisation-colour', () => {
  const sassBootstrap = `
    $govuk-new-organisation-colours: true;
    $govuk-colours-organisations: (
      'floo-network-authority': (
        colour: #EC22FF,
        contrast-safe: #9A00A8
      ),
      'broom-regulatory-control': (
        colour: #A81223
      ),
      'house-elf-equalities-office': (
        colour: #786999,
        deprecation-message: 'The House Elf Equalities Office was disbanded in 2007.'
      )
    );

    @import "helpers/colour";
  `

  it('returns the contrast-safe colour for a given organisation by default', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('floo-network-authority');
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
        color: govuk-organisation-colour('broom-regulatory-control');
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

  it('can be overridden to return the non-contrast-safe colour ($contrast-safe parameter)', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: govuk-organisation-colour('floo-network-authority', $contrast-safe: false);
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

  it('can be overridden to return the non-contrast-safe colour (deprecated $websafe parameter)', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: govuk-organisation-colour('floo-network-authority', $websafe: false);
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
        color: govuk-organisation-colour('house-elf-equalities-office');
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The House Elf Equalities Office was disbanded in 2007. To silence this warning, update $govuk-suppressed-warnings with key: "organisation-colours"',
      expect.anything()
    )
  })

  it('throws an error if a non-existent organisation is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('muggle-born-registration-commission');
      }
    `

    await expect(compileSassString(sass, sassConfig)).rejects.toThrow(
      'Unknown organisation `muggle-born-registration-commission`'
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

  describe('legacy palette', () => {
    const sassBootstrapLegacy = `
      $govuk-colours-organisations: (
        'floo-network-authority': (
          colour: #EC22FF,
          colour-websafe: #9A00A8
        ),
        'broom-regulatory-control': (
          colour: #A81223
        )
      );

      @import "helpers/colour";
    `

    it('returns the contrast-safe colour for a given organisation by default', async () => {
      const sass = `
        ${sassBootstrapLegacy}

        .foo {
          color: govuk-organisation-colour('floo-network-authority');
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
        ${sassBootstrapLegacy}

        .foo {
          color: govuk-organisation-colour('broom-regulatory-control');
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

    it('can be overridden to return the non-contrast-safe colour ($websafe parameter)', async () => {
      const sass = `
        ${sassBootstrapLegacy}

        .foo {
          border-color: govuk-organisation-colour('floo-network-authority', $websafe: false);
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
  })

  describe('legacy deprecation message', () => {
    it('throws a deprecation warning if the legacy palette is being used', async () => {
      const sass = `
      @import "helpers/colour";

      .dft {
        border-color: govuk-organisation-colour('department-for-transport');
      }
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      expect(mockWarnFunction).toHaveBeenCalledWith(
        "We've updated the organisation colour palette. Opt in to the new " +
          'colours using `$govuk-new-organisation-colours: true`. The old ' +
          "palette is deprecated and we'll remove it in the next major " +
          'version. To silence this warning, update $govuk-suppressed-warnings ' +
          'with key: "legacy-organisation-colours"',
        expect.anything()
      )
    })

    it('does not throw a deprecation warning if the new palette is being used', async () => {
      const sass = `
      $govuk-new-organisation-colours: true;
      @import "settings/colours-organisations";
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have not been called
      expect(mockWarnFunction).not.toHaveBeenCalled()
    })

    it('does not throw a deprecation warning if the palette has been customised', async () => {
      const sass = `
      $govuk-colours-organisations: (
        "department-of-administrative-affairs": (
          colour: "#226623"
        )
      );
      @import "settings/colours-organisations";
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have not been called
      expect(mockWarnFunction).not.toHaveBeenCalled()
    })
  })
})

describe('@function govuk-shade', () => {
  it('outputs hexadecimal values', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-shade(rgb(171, 205, 239), 17);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            color: #8eaac6;
          }
        `
    })
  })
})

describe('@function govuk-tint', () => {
  it('outputs hexadecimal values', async () => {
    const sass = `
      @import "helpers/colour";

      .foo {
        color: govuk-tint(rgb(18, 52, 86), 17);
      }
    `

    await expect(compileSassString(sass, sassConfig)).resolves.toMatchObject({
      css: outdent`
          .foo {
            color: #3a5773;
          }
        `
    })
  })
})
