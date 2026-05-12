import fs from 'fs'

import { outdent } from 'outdent'

import {
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

  describe('Update changelog', () => {
    it('adds a new heading to the changelog for the new version', () => {
      updateChangelog('3.1.0', '3.0.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0 (Feature release)')
      )
    })

    it('prefixes a new heading with a pre-release identifier if the new version is a pre-release', () => {
      updateChangelog('3.1.0-beta.0', '3.0.0')
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

      updateChangelog('3.1.0-beta.1', '3.1.0-beta.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('## v3.1.0-beta.1 (Beta feature release)')
      )
    })

    it('displays a warning to not use non-stable releases in production', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ### Fixes

        Bing bong

        ## v3.1.0-beta.0 (Beta feature release)
      `)

      updateChangelog('3.1.0-beta.1', '3.1.0-beta.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining(outdent`
          ## v3.1.0-beta.1 (Beta feature release)
          > [!WARNING]
          > Do not use in production.
          > Use this release to prepare for the changes coming in version \`3.1.0\`.
        `)
      )
    })

    it('does not display a warning when the change is a stable release', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ### Fixes

        Bing bong

        ## v3.1.0 (Feature release)
      `)

      updateChangelog('3.1.1', '3.1.0')
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(
        './CHANGELOG.md',
        expect.stringContaining('> [!WARNING]')
      )
    })

    it('does not change the changelog if the provided version is an internal pre-release', () => {
      const consoleLogSpy = jest.spyOn(console, 'log')

      updateChangelog('3.1.0-internal.0', '3.0.0')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'This is an internal release, intended for testing only. The changelog will therefore not be updated.'
      )
      expect(fs.writeFileSync).not.toHaveBeenCalled()
    })
  })

  describe('Generate release notes', () => {
    it('writes release notes from the changelog from the last version heading', () => {
      jest.mocked(fs.readFileSync).mockReturnValue(`
        ## Unreleased

        ## v3.1.0 (Feature release)

        ### Fixes

        Bing bong

        ## v3.0.0 (Breaking release)
      `)

      generateReleaseNotes('3.1.0')
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

      generateReleaseNotes('3.1.0-beta.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('writes release notes from the changelog from the Unreleased heading if the version is internal', () => {
      generateReleaseNotes('3.1.0-internal.0')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('Bing bong')
      )
    })

    it('increases the heading levels from the changelog by one', () => {
      generateReleaseNotes('Unreleased')
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining('## Fixes')
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.not.stringContaining('### Fixes')
      )
    })

    it('adds a note on the generation workflow if options param provided', () => {
      generateReleaseNotes('3.1.0-internal.0', {
        actor: 'bingbong',
        runId: '12345'
      })
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './release-notes-body',
        expect.stringContaining(
          'Pull request generated on behalf of @bingbong by [run 12345](https://github.com/alphagov/govuk-frontend/actions/runs/12345) of the [Build release workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/build-release.yml)'
        )
      )
    })
  })
})
