/* eslint-env jest */

const util = require('util')

const configPaths = require('../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'compact'
}

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

describe('@function govuk-organisation-colour', () => {
  it('returns the colour for a given organisation', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        background: govuk-organisation-colour('floo-network-authority');
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { background: #EC22FF; }')
  })

  it('returns the websafe colour for a given organisation if requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('floo-network-authority', $websafe: true);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #9A00A8; }')
  })

  it('falls back to the default colour if websafe is requested but not defined for that organisation', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('broom-regulatory-control', $websafe: true);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #A81223; }')
  })

  it('throws an error if a non-existent organisation is requested', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('muggle-born-registration-commission');
      }`

    await expect(sassRender({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Unknown organisation `muggle-born-registration-commission`'
      )
  })
})
