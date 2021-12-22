/* eslint-env jest */

const packageJson = require('./package.json')

describe('because rollup 0.60 drops support for Internet Explorer 8', () => {
  describe('rollup', () => {
    it('should be pinned to 0.56.5 in package.json', () => {
      expect(packageJson.devDependencies['rollup']).toEqual('0.56.5')
    })
  })
})
