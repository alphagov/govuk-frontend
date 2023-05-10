import { join } from 'path'

import { Browser, Cache, detectBrowserPlatform, install, resolveBuildId } from '@puppeteer/browsers'
import { paths } from 'govuk-frontend-config'

/**
 * Puppeteer browser downloader
 */
export async function download () {
  const browser = Browser.CHROME
  const platform = detectBrowserPlatform()

  // Download management
  const cacheDir = join(paths.root, '.cache', 'puppeteer')
  const cache = new Cache(cacheDir)

  // Downloaded versions
  const buildId = await resolveBuildId(browser, platform, 'stable')
  const versions = cache.getInstalledBrowsers()

  // Download latest browser (unless cached)
  if (!versions.some((version) => version.buildId === buildId)) {
    await cache.clear()

    // Install into cache directory
    await install({ browser, buildId, cacheDir })
  }
}
