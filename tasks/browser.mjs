import { join } from 'path'

import percySnapshot from '@percy/puppeteer'
import { isPercyEnabled } from '@percy/sdk-utils'
import { paths } from 'govuk-frontend-config'
import { download } from 'govuk-frontend-config/jest/browser/download.mjs'
import { helpers } from 'govuk-frontend-lib'
import puppeteer from 'puppeteer'

const { filterPath, getDirectories, getListing } = helpers.files
const { goToComponent, goToExample } = helpers.puppeteer

/**
 * Puppeteer browser launcher
 */
export async function launch () {
  await download()

  // Open browser
  return puppeteer.launch()
}

/**
 * Send screenshots in concurrent batches to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshots () {
  if (!await isPercyEnabled()) {
    throw new Error('Percy healthcheck failed')
  }

  const browser = await launch()
  const componentNames = await getDirectories(join(paths.src, 'govuk/components'))
  const exampleNames = ['text-alignment', 'typography']

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
  const componentFiles = await getListing(join(paths.src, 'govuk/components', componentName))

  // Navigate to component
  await goToComponent(page, componentName)

  // Screenshot preview page (with JavaScript)
  await percySnapshot(page, `js: ${componentName}`)

  // Check for "JavaScript enabled" components
  if (componentFiles.some(filterPath([`**/${componentName}.mjs`]))) {
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

  // Dismiss app banner
  await page.setCookie({
    name: 'dismissed-app-banner',
    value: 'yes',
    url: page.url()
  })

  // Screenshot preview page
  await page.reload({ waitUntil: 'load' })
  await percySnapshot(page, `js: ${exampleName} (example)`)

  // Close page
  return page.close()
}
