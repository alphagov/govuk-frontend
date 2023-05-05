const { compileSassString } = require('govuk-frontend-helpers/tests')
const { outdent } = require('outdent')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn()
  .mockReturnValue(sassNull)

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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: #ff0000;
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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: #ff0000;
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

    await expect(compileSassString(sass, sassConfig))
      .rejects
      .toThrow(
        'Unknown colour `hooloovoo`'
      )
  })

  describe('when $govuk-use-legacy-palette is true', () => {
    beforeEach(() => {
      sassBootstrap = `
        @import "settings/warnings";
        $govuk-use-legacy-palette: true;
        ${sassBootstrap}
      `
    })

    it('returns the legacy colour if specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: 'blue');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #0000ff;
            }
          `
        })
    })

    it('returns the legacy literal if specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: #BADA55);
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #BADA55;
            }
          `
        })
    })

    it('does not error if the non-legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('hooloovoo', $legacy: 'blue');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #0000ff;
            }
          `
        })
    })

    it('throws an error if the legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}
        .foo {
          color: govuk-colour('red', $legacy: 'hooloovoo');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .rejects
        .toThrow(
          'Unknown colour `hooloovoo`'
        )
    })

    it('outputs a deprecation warning when set to true', async () => {
      const sass = `${sassBootstrap}`

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      expect(mockWarnFunction.mock.calls[0])
        .toEqual(expect.arrayContaining([
          '$govuk-use-legacy-palette is deprecated. Only the modern colour ' +
            'palette will be supported from v5.0. To silence this warning, ' +
            'update $govuk-suppressed-warnings with key: "legacy-palette"'
        ]))
    })

    it('outputs a deprecation warning when a $legacy colour is specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: 'blue');
        }
      `

      await compileSassString(sass, sassConfig)

      // The $govuk-use-legacy-palette warning is always returned first, so look
      // at index 1 of our array for this warning instead.
      expect(mockWarnFunction.mock.calls[1])
        .toEqual(expect.arrayContaining([
          'The $legacy parameter is deprecated. Only the modern colour ' +
            'palette will be supported from v5.0.'
        ]))
    })
  })

  describe('when $govuk-use-legacy-palette is false', () => {
    beforeEach(() => {
      sassBootstrap = `
        $govuk-use-legacy-palette: false;
        ${sassBootstrap}
      `
    })

    it('does not return the legacy colour', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: 'blue');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #ff0000;
            }
          `
        })
    })

    it('does not returns the legacy literal when specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: #BADA55);
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #ff0000;
            }
          `
        })
    })

    it('throws an error if the non-legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('hooloovoo', $legacy: 'blue');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .rejects
        .toThrow(
          'Unknown colour `hooloovoo`'
        )
    })

    it('does not error if the legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: govuk-colour('red', $legacy: 'hooloovoo');
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: outdent`
            .foo {
              color: #ff0000;
            }
          `
        })
    })
  })
})

describe('@function govuk-organisation-colour', () => {
  const sassBootstrap = `
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

  it('returns the websafe colour for a given organisation by default', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('floo-network-authority');
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: #9A00A8;
          }
        `
      })
  })

  it('falls back to the default colour if a websafe colour is not explicitly defined', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('broom-regulatory-control');
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: #A81223;
          }
        `
      })
  })

  it('can be overridden to return the non-websafe colour', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: govuk-organisation-colour('floo-network-authority', $websafe: false);
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            border-color: #EC22FF;
          }
        `
      })
  })

  it('throws an error if a non-existent organisation is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('muggle-born-registration-commission');
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .rejects
      .toThrow(
        'Unknown organisation `muggle-born-registration-commission`'
      )
  })
})
