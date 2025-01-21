import fs from 'fs'

import { validateVersion } from './changelog-release-helper.mjs'

jest.mock('fs')

describe('Changelog release helper', () => {
  const fakeInitialChangelog = `
    ## Unreleased

    Bing bong

    ## v3.0.0 (Breaking release)
  `

  beforeAll(async () => {
    await fs.readFileSync.mockReturnValue(fakeInitialChangelog)
  })

  describe('Validate version', () => {
    it('runs normally if a valid new version is parsed to it', async () => {
      await expect(async () => await validateVersion('3.1.0')).not.toThrow()
    })

    it('throws an error if an invalid semver is parsed', async () => {
      await expect(async () => await validateVersion('pizza')).toThrow()
    })
  })
})
