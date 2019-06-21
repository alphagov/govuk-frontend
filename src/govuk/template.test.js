/* eslint-env jest */

const nunjucks = require('nunjucks')
const configPaths = require('../../config/paths.json')

describe('Template', () => {
  describe('with default nunjucks configuration', () => {
    it('should not have any whitespace before the doctype', () => {
      nunjucks.configure(configPaths.src)
      const output = nunjucks.render('./template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })
  describe('with nunjucks block trimming enabled', () => {
    it('should not have any whitespace before the doctype', () => {
      nunjucks.configure(configPaths.src, {
        trimBlocks: true,
        lstripBlocks: true
      })
      const output = nunjucks.render('./template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })
})
