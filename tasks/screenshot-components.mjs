import { join } from 'path'

import percySnapshot from '@percy/puppeteer'
import { isPercyEnabled } from '@percy/sdk-utils'
import { launch } from 'puppeteer'

import configPaths from '../config/paths.js'
import { getDirectories, getListing } from '../lib/file-helper.js'
import { goToComponent } from '../lib/puppeteer-helpers.js'

/**
 * Send all component screenshots to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshotComponents () {
  const browser = await launch()
  const componentNames = await getDirectories(configPaths.components)

  // Screenshot each component
  const input = [...componentNames]

  // Screenshot 4x components concurrently
  while (input.length) {
    const batch = input.splice(0, 4)

    await Promise.all(batch
      .map(async (componentName) => screenshotComponent(await browser.newPage(), componentName))
    )
  }

  // Close browser
  return browser.close()
}

/**
 * Send single component screenshots to Percy
 * for visual regression testing
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} componentName - Component name
 * @returns {Promise<void>}
 */
export async function screenshotComponent (page, componentName) {
  const componentFiles = await getListing(configPaths.components, `**/${componentName}/**`)

  // Screenshot preview page (with JavaScript)
  await goToComponent(page, componentName)
  await percySnapshot(page, `js: ${componentName}`)

  // Check for "JavaScript enabled" components
  if (componentFiles.includes(join(componentName, `${componentName}.mjs`))) {
    await page.setJavaScriptEnabled(false)

    // Screenshot preview page (without JavaScript)
    await page.reload({ waitUntil: 'load' })
    await percySnapshot(page, `no-js: ${componentName}`)
  }

  // Close page
  return page.close()
}

if (!await isPercyEnabled()) {
  throw new Error('Percy healthcheck failed')
}

await screenshotComponents()
