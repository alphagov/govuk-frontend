const packageLockJson = require('./package-lock.json')
const packageJson = require('./tasks/package.json')

describe('because rollup 0.60 drops support for Internet Explorer 8', () => {
  describe('rollup', () => {
    it('should be pinned to 0.59.4 in package.json', () => {
      expect(packageJson.dependencies.rollup).toEqual('0.59.4')
    })

    it('should be pinned to 0.59.4 in package-lock.json', () => {
      expect(packageLockJson.packages['node_modules/rollup'].version).toEqual('0.59.4')
    })
  })
})
