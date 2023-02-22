import { join } from 'path'

import puppeteer from 'puppeteer'

import configPuppeteer from '../../puppeteer.config.js'

/**
 * Puppeteer browser downloader
 */
export async function download () {
  const fetcher = puppeteer.createBrowserFetcher({
    path: join(configPuppeteer.cacheDirectory, 'chrome')
  })

  // Downloaded versions
  const versions = fetcher.localRevisions()

  // Download latest browser (unless cached)
  if (!versions.includes(puppeteer.defaultBrowserRevision)) {
    await fetcher.download(puppeteer.defaultBrowserRevision)

    // Remove outdated browser versions
    for (const version of versions) {
      await fetcher.remove(version)
    }
  }
}
