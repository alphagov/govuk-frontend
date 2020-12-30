/* eslint-env jest */

const { renderSass } = require('../../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compact'
}

describe('@function moaland-colour', () => {
  let sassBootstrap = ''

  beforeEach(() => {
    sassBootstrap = `
      $moaland-colours: (
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
        color: moaland-colour('red');
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #ff0000; }')
  })

  it('works with unquoted strings', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: moaland-colour(red);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #ff0000; }')
  })

  it('throws an error if a non-existent colour is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: moaland-colour('hooloovoo');
      }`

    await expect(renderSass({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Unknown colour `hooloovoo`'
      )
  })

  describe('when $moaland-use-legacy-palette is true', () => {
    beforeEach(() => {
      sassBootstrap = `
        $moaland-use-legacy-palette: true;
        ${sassBootstrap}
      `
    })

    it('returns the legacy colour if specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('red', $legacy: 'blue');
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #0000ff; }')
    })

    it('returns the legacy literal if specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('red', $legacy: #BADA55);
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #BADA55; }')
    })

    it('does not error if the non-legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('hooloovoo', $legacy: 'blue');
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #0000ff; }')
    })

    it('throws an error if the legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}
        .foo {
          color: moaland-colour('red', $legacy: 'hooloovoo');
        }`

      await expect(renderSass({ data: sass, ...sassConfig }))
        .rejects
        .toThrow(
          'Unknown colour `hooloovoo`'
        )
    })
  })

  describe('when $moaland-use-legacy-palette is false', () => {
    beforeEach(() => {
      sassBootstrap = `
        $moaland-use-legacy-palette: false;
        ${sassBootstrap}
      `
    })

    it('does not return the legacy colour', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('red', $legacy: 'blue');
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #ff0000; }')
    })

    it('does not returns the legacy literal when specified', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('red', $legacy: #BADA55);
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #ff0000; }')
    })

    it('throws an error if the non-legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('hooloovoo', $legacy: 'blue');
        }`

      await expect(renderSass({ data: sass, ...sassConfig }))
        .rejects
        .toThrow(
          'Unknown colour `hooloovoo`'
        )
    })

    it('does not error if the legacy colour does not exist', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          color: moaland-colour('red', $legacy: 'hooloovoo');
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe('.foo { color: #ff0000; }')
    })
  })
})

describe('@function moaland-organisation-colour', () => {
  const sassBootstrap = `
    $moaland-colours-organisations: (
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
        color: moaland-organisation-colour('floo-network-authority');
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #9A00A8; }')
  })

  it('falls back to the default colour if a websafe colour is not explicitly defined', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: moaland-organisation-colour('broom-regulatory-control');
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #A81223; }')
  })

  it('can be overridden to return the non-websafe colour', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: moaland-organisation-colour('floo-network-authority', $websafe: false);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { border-color: #EC22FF; }')
  })

  it('throws an error if a non-existent organisation is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: moaland-organisation-colour('muggle-born-registration-commission');
      }`

    await expect(renderSass({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Unknown organisation `muggle-born-registration-commission`'
      )
  })
})
