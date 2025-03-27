import fs from 'fs'

import {
  validateVersion,
  updateChangelog,
  generateReleaseNotes
} from './changelog-release-helper.mjs'

jest.mock('fs')

describe('Changelog release helper', () => {
  beforeEach(() => {
    jest.mocked(fs.readFileSync).mockReturnValue(`
    ## Unreleased

    ### Fixes

    Bing bong

    ## v3.0.0 (Breaking release)
  `)
  })

  describe('Validate version', () => {
    it('runs normally if a valid new version is parsed to it', () => {
      expect(() => validateVersion('3.1.0')).not.toThrow()
    })

    it('throws an error if an invalid semver is parsed', () => {
      expect(() => validateVersion('pizza')).toThrow(
        'New version number pizza could not be processed by Semver. Please ensure you are providing a valid semantic version'
      )
    })

    it('throws an error if new version is less than old version', () => {
      expect(() => validateVersion('2.11.0')).toThrow(
        'New version number 2.11.0 is less than or equal to the most recent version (3.0.0). Please provide a newer version number'
      )
    })

    it.each([
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
      },
      {
        badVersion: '3.0.2-beta.0',
        type: 'prepatch',
        goodVersion: '3.0.1-beta.0'
      },
      {
        badVersion: '3.0.2',
        type: 'patch',
        goodVersion: '3.0.1',
        customLastTitle: '3.0.1-beta.15 (Beta patch release)'
      }
    ])(
      'throws an error if new version is more than one possible `$type` increment',
      ({ badVersion, type, goodVersion, customLastTitle }) => {
        if (customLastTitle) {
          jest.mocked(fs.readFileSync).mockReturnValue(`
          ## Unreleased

          ### Fixes

          Bing bong

          ## v${customLastTitle}
        `)
        }

        expect(() => validateVersion(badVersion)).toThrow(
          `New version number ${badVersion} is incrementing more than one for its increment type (${type}). Please provide a version number than only increments by one from the current version. In this case, it's likely that your new version number should be: ${goodVersion}`
        )
      }
    )
  })

  describe('Update changelog', () => {
    it('adds a new heading to the changelog for the new version', () => {
      updateChangelog('3.1.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0 (Feature release)')
      )
    })

    it('prefixes a new heading with a pre-release identifier if the new version is a pre-release', () => {
      updateChangelog('3.1.0-beta.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0-beta.0 (Beta feature release)')
      )
    })

    it('copies the previous release type if the new version is a prerelease increment', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ### Fixes

        Bing bong

        ## v3.1.0-beta.0 (Beta feature release)
      `)

      updateChangelog('3.1.0-beta.1')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0-beta.1 (Beta feature release)')
      )
    })

    it('does not change the changelog if the provided version is an internal pre-release', () => {
      const consoleLogSpy = jest.spyOn(console, 'log')

      updateChangelog('3.1.0-internal.0')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'This is an internal release, intended for testing only. The changelog will therefore not be updated.'
      )
      expect(fs.writeFileSync).not.toHaveBeenCalled()
    })
  })

  describe('Generate release notes', () => {
    it('writes release notes from the changelog from the Unreleased heading', () => {
      // Pass 'true' here so that the function reads from the 'Unreleased' heading
      generateReleaseNotes(true)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('writes release notes from the changelog from the last version heading', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ## v3.1.0 (Feature release)

        ### Fixes

        Bing bong

        ## v3.0.0 (Breaking release)
      `)

      generateReleaseNotes()
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('writes release notes from the changelog from the last version heading if that version is a pre-release', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ## v3.1.0-beta.0 (Feature release)

        ### Fixes

        Bing bong

        ## v3.0.0 (Breaking release)
      `)

      generateReleaseNotes()
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('increases the heading levels from the changelog by one', () => {
      generateReleaseNotes(true)
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
