import { join } from 'path'

import { Browser, Cache, install } from '@puppeteer/browsers'
import { paths } from 'govuk-frontend-config'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions.js'

/**
 * Puppeteer browser downloader
 */
export async function download () {
  const browser = Browser.CHROME

  // Download management
  const cacheDir = join(paths.root, '.cache', 'puppeteer')
  const cache = new Cache(cacheDir)

  // Downloaded versions
  const buildId = PUPPETEER_REVISIONS.chrome
  const versions = cache.getInstalledBrowsers()

  // Download latest browser (unless cached)
  if (!versions.some((version) => version.buildId === buildId)) {
    await cache.clear()

    // Install into cache directory
    await install({ browser, buildId, cacheDir })
  }
}
