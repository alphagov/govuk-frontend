/* eslint-env jest */

const { renderSass } = require('../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compressed'
}

describe('@function iff', () => {
  it('outputs if the condition is truthy', async () => {
    const sass = `
      @import 'tools/iff';

      .foo {
        color: red iff(true, !important);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(`.foo{color:red !important}`)
  })

  it('does not output if the condition is falsey', async () => {
    const sass = `
      @import 'tools/iff';

      .foo {
        color: red iff(false, !important);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(`.foo{color:red}`)
  })
})
