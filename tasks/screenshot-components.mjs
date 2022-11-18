import { join } from 'path'
import { launch } from 'puppeteer'
import percySnapshot from '@percy/puppeteer'
import { isPercyEnabled } from '@percy/sdk-utils'

import { getDirectories, getListing } from '../lib/file-helper.js'
import { goToComponent } from '../lib/puppeteer-helpers.js'

import configPaths from '../config/paths.js'
import configPuppeteer from '../puppeteer.config.js'

/**
 * Send all component screenshots to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshotComponents () {
  const browser = await launch(configPuppeteer.launch)
  const componentNames = await getDirectories(configPaths.components)

  // Screenshot each component in sequence
  for (const componentName of componentNames) {
    await screenshotComponent(await browser.newPage(), componentName)
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
