import fs from 'fs'

import {
  validateVersion,
  updateChangelog,
  generateReleaseNotes
} from './changelog-release-helper.mjs'

jest.mock('fs')

describe('Changelog release helper', () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue(`
    ## Unreleased

    ### Fixes

    Bing bong

    ## v3.0.0 (Breaking release)
  `)
  })

  describe('Validate version', () => {
    it('runs normally if a valid new version is parsed to it', async () => {
      await expect(validateVersion('3.1.0')).resolves.not.toThrow()
    })

    it('throws an error if an invalid semver is parsed', async () => {
      await expect(validateVersion('pizza')).rejects.toThrow(
        'New version number pizza could not be processed by Semver. Please ensure you are providing a valid semantic version'
      )
    })

    it('throws an error if new version is less than old version', async () => {
      await expect(validateVersion('2.11.0')).rejects.toThrow(
        'New version number 2.11.0 is less than or equal to the most recent version (3.0.0). Please provide a newer version number'
      )
    })

    it('throws an error if new version is more than one possible increment', async () => {
      const increments = [
        {
          badVersion: '5.0.0',
          type: 'major',
          goodVersion: '4.0.0'
        },
        {
          badVersion: '3.2.0',
          type: 'minor',
          goodVersion: '3.1.0'
        },
        {
          badVersion: '3.0.2',
          type: 'patch',
          goodVersion: '3.0.1'
        }
      ]

      for (const increment of increments) {
        await expect(validateVersion(increment.badVersion)).rejects.toThrow(
          `New version number ${increment.badVersion} is incrementing more than one for its increment type (${increment.type}). Please provide a version number than only increments by one from the current version. In this case, it's likely that your new version number should be: ${increment.goodVersion}`
        )
      }
    })
  })

  describe('Update changelog', () => {
    it('adds a new heading to the changelog for the new version', async () => {
      await updateChangelog('3.1.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0 (Feature release)')
      )
    })
  })

  describe('Generate release notes', () => {
    it('writes release notes from the changelog from the Unreleased heading', async () => {
      // Pass 'true' here so that the function reads from the 'Unreleased' heading
      await generateReleaseNotes(true)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('writes release notes from the changelog from the last version heading', async () => {
      // re-mock the readFileSync return value as if we'd just run
      // updateChangelog and the contents we wanted was between the new and
      // current version headings
      fs.readFileSync.mockReturnValue(`
        ## Unreleased

        ## v3.1.0 (Feature release)

        ### Fixes

        Bing bong

        ## v3.0.0 (Breaking release)
      `)

      await generateReleaseNotes()
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('increases the heading levels from the changelog by one', async () => {
      await generateReleaseNotes(true)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('## Fixes')
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.not.stringContaining('### Fixes')
      )
    })
  })
})
