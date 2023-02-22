import percySnapshot from '@percy/puppeteer'
import { isPercyEnabled } from '@percy/sdk-utils'
import { launch } from 'puppeteer'

import configPaths from '../config/paths.js'
import { filterPath, getDirectories, getListing } from '../lib/file-helper.js'
import { goToComponent, goToExample } from '../lib/puppeteer-helpers.js'

import { download } from './browser/download.mjs'

/**
 * Send screenshots in concurrent batches to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshots () {
  const browser = await launch()

  // Screenshot stack
  const input = []

  // Add components to screenshot
  input.push(...componentNames.map((screenshotName) =>
    /** @type {const} */ ([screenshotComponent, screenshotName])))

  // Add examples to screenshot
  input.push(...exampleNames.map((screenshotName) =>
    /** @type {const} */ ([screenshotExample, screenshotName])))

  // Batch 4x concurrent screenshots
  while (input.length) {
    const batch = input.splice(0, 4)

    // Take screenshots
    const screenshotTasks = batch.map(async ([screenshotFn, screenshotName]) =>
      screenshotFn(await browser.newPage(), screenshotName))

    // Wait until batch finishes
    await Promise.all(screenshotTasks)
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
  await goToComponent(page, componentName)

  // Screenshot preview page (with JavaScript)
  await percySnapshot(page, `js: ${componentName}`)

  // Check for "JavaScript enabled" components
  if (componentsFiles.some(filterPath([`**/${componentName}.mjs`]))) {
    await page.setJavaScriptEnabled(false)

    // Screenshot preview page (without JavaScript)
    await page.reload({ waitUntil: 'load' })
    await percySnapshot(page, `no-js: ${componentName}`)
  }

  // Close page
  return page.close()
}

/**
 * Send single example screenshot to Percy
 * for visual regression testing
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} exampleName - Component name
 * @returns {Promise<void>}
 */
export async function screenshotExample (page, exampleName) {
  await goToExample(page, exampleName)

  // Screenshot preview page
  await percySnapshot(page, `js: ${exampleName} (example)`)

  // Close page
  return page.close()
}

if (!await isPercyEnabled()) {
  throw new Error('Percy healthcheck failed')
}

const [componentNames, componentsFiles] = await Promise.all([
  getDirectories(configPaths.components),
  getListing(configPaths.components),
  download() // Download browser
])

const exampleNames = [
  'text-alignment',
  'typography'
]

await screenshots() // Take screenshots
