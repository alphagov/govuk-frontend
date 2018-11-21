/* eslint-env jest */

const packageJson = require('./package.json')
const packageLockJson = require('./package-lock.json')

describe('because rollup 0.60 drops support for Internet Explorer 8', () => {
  describe('gulp-better-rollup', () => {
    it('should be pinned to 3.1.0 in package.json', () => {
      expect(packageJson.devDependencies['gulp-better-rollup']).toEqual('3.1.0')
    })
  })

  describe('rollup', () => {
    it('should be pinned to 0.56.5 in package-lock.json', () => {
      expect(packageLockJson.dependencies['gulp-better-rollup'].requires.rollup).toEqual('0.56.5')
      expect(packageLockJson.dependencies['gulp-better-rollup'].dependencies.rollup.version).toEqual('0.56.5')
    })
  })
})
