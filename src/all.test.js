/* eslint-env jest */

const util = require('util')

const configPaths = require('../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ]
}

describe('GOV.UK Frontend', () => {
  describe('global styles', async() => {
    it('are disabled by default', async () => {
      const sass = `
        @import "all";
      `
      const results = await sassRender({ data: sass, ...sassConfig })
      expect(results.css.toString()).not.toContain(', a {')
      expect(results.css.toString()).not.toContain(', p {')
    })
    it('are enabled if $global-styles variable is set to true', async () => {
      const sass = `
        $govuk-global-styles: true;
        @import "all";
      `
      const results = await sassRender({ data: sass, ...sassConfig })
      expect(results.css.toString()).toContain(', a {')
      expect(results.css.toString()).toContain(', p {')
    })
  })
})
