import { join } from 'path'

import { paths } from '@govuk-frontend/config'
/* eslint-disable-next-line no-redeclare --
  Cache (part of workers API) is not implemented in JSDom
  so no collision https://github.com/jsdom/jsdom/issues/2422 */
import { Browser, Cache, install } from '@puppeteer/browsers'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions.js'

/**
 * Puppeteer browser downloader
 */
export async function download() {
  const browser = Browser.CHROME

  // Download management
  const cacheDir = join(paths.root, '.cache', 'puppeteer')
  const cache = new Cache(cacheDir)

  // Downloaded versions
  const buildId = PUPPETEER_REVISIONS.chrome
  const previousVersions = cache.getInstalledBrowsers()

  // Download latest browser (unless cached)
  if (!previousVersions.some((version) => version.buildId === buildId)) {
    await cache.clear()

    // Install into cache directory
    await install({ browser, buildId, cacheDir })
  }

  const currentVerisons = cache.getInstalledBrowsers()
  if (!currentVerisons || !currentVerisons.length) {
    throw new Error('No browser versions are installed.')
  }
}
