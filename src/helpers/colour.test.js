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
  it('returns the websafe colour for a given organisation by default', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('floo-network-authority');
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #9A00A8; }')
  })

  it('falls back to the default colour if a websafe colour is not explicitly defined', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        color: govuk-organisation-colour('broom-regulatory-control');
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { color: #A81223; }')
  })

  it('can be overridden to return the non-websafe colour', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        border-color: govuk-organisation-colour('floo-network-authority', $websafe: false);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo { border-color: #EC22FF; }')
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
