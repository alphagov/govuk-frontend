import { Cache, install, resolveBuildId } from '@puppeteer/browsers'

import { download } from './download.mjs'

jest.mock('@puppeteer/browsers')

describe('Browser tasks: Puppeteer browser downloader', () => {
  let browsers

  beforeEach(() => {
    browsers = []

    // Mock Puppeteer browsers API
    jest.mocked(resolveBuildId).mockImplementation(async () => 'new-version')
    jest.mocked(Cache.prototype.getInstalledBrowsers).mockImplementation(() => browsers)
    jest.mocked(Cache.prototype.clear).mockReturnValue()
  })

  it('downloads by default', async () => {
    await download()

    expect(install).toHaveBeenCalledWith(expect.objectContaining({ buildId: 'new-version' }))
    expect(install).toHaveBeenCalledTimes(1)

    // Outdated versions always removed
    expect(Cache.prototype.clear).toHaveBeenCalledTimes(1)
  })

  it('downloads with single version outdated', async () => {
    browsers = [
      {
        path: '/path/to/govuk-frontend/.cache/puppeteer/chrome/mac-old-version',
        browser: 'chrome',
        platform: 'mac',
        buildId: 'old-version'
      }
    ]

    await download()

    expect(install).toHaveBeenCalledWith(expect.objectContaining({ buildId: 'new-version' }))
    expect(install).toHaveBeenCalledTimes(1)

    // Outdated versions always removed
    expect(Cache.prototype.clear).toHaveBeenCalledTimes(1)
  })

  it('downloads with multiple versions outdated', async () => {
    browsers = [
      {
        path: '/path/to/govuk-frontend/.cache/puppeteer/chrome/mac-old-version-1',
        browser: 'chrome',
        platform: 'mac',
        buildId: 'old-version-1'
      },
      {
        path: '/path/to/govuk-frontend/.cache/puppeteer/chrome/mac-old-version-2',
        browser: 'chrome',
        platform: 'mac',
        buildId: 'old-version-2'
      }
    ]

    await download()

    expect(install).toHaveBeenCalledWith(expect.objectContaining({ buildId: 'new-version' }))
    expect(install).toHaveBeenCalledTimes(1)

    // Outdated versions always removed
    expect(Cache.prototype.clear).toHaveBeenCalledTimes(1)
  })

  it('download skipped when up-to-date', async () => {
    browsers = [
      {
        path: '/path/to/govuk-frontend/.cache/puppeteer/chrome/mac-new-version',
        browser: 'chrome',
        platform: 'mac',
        buildId: 'new-version'
      }
    ]

    await download()

    expect(install).not.toHaveBeenCalled()
    expect(Cache.prototype.clear).not.toHaveBeenCalled()
  })
})
