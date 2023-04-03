import puppeteer from 'puppeteer'

import { download } from './browser.mjs'

jest.mock('puppeteer')

describe('Browser tasks: Puppeteer browser downloader', () => {
  let browserFetcher
  let localRevisions

  beforeEach(() => {
    localRevisions = []

    browserFetcher = {
      localRevisions: jest.fn(() => localRevisions),
      download: jest.fn(),
      remove: jest.fn()
    }

    // Mock browser version
    // @ts-expect-error 'defaultBrowserRevision' is marked @internal
    puppeteer.defaultBrowserRevision = 'new-version'

    // Mock browser fetcher
    puppeteer.createBrowserFetcher = jest.fn(() => browserFetcher)
  })

  it('downloads by default', async () => {
    await download()

    expect(browserFetcher.download).toHaveBeenCalledWith('new-version')
    expect(browserFetcher.download).toHaveBeenCalledTimes(1)

    // Outdated versions not available
    expect(browserFetcher.remove).not.toHaveBeenCalled()
  })

  it('downloads with single version outdated', async () => {
    localRevisions = ['old-version']

    await download()

    expect(browserFetcher.download).toHaveBeenCalledWith('new-version')
    expect(browserFetcher.download).toHaveBeenCalledTimes(1)

    // Outdated version removed
    expect(browserFetcher.remove).toHaveBeenCalledWith('old-version')
    expect(browserFetcher.remove).toHaveBeenCalledTimes(1)
  })

  it('downloads with multiple versions outdated', async () => {
    localRevisions = [
      'old-version-1',
      'old-version-2'
    ]

    await download()

    expect(browserFetcher.download).toHaveBeenCalledWith('new-version')
    expect(browserFetcher.download).toHaveBeenCalledTimes(1)

    // Outdated versions removed
    expect(browserFetcher.remove).toHaveBeenCalledWith('old-version-1')
    expect(browserFetcher.remove).toHaveBeenCalledWith('old-version-2')
    expect(browserFetcher.remove).toHaveBeenCalledTimes(2)
  })

  it('download skipped when up-to-date', async () => {
    localRevisions = ['new-version']

    await download()

    expect(browserFetcher.download).not.toHaveBeenCalled()
    expect(browserFetcher.remove).not.toHaveBeenCalled()
  })
})
