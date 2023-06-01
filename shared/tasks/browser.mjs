import percySnapshot from '@percy/puppeteer'
import { download } from 'govuk-frontend-helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from 'govuk-frontend-helpers/puppeteer'
import { filterPath, getComponentNames, getListing } from 'govuk-frontend-lib/files'
import { packageNameToPath } from 'govuk-frontend-lib/names'
import puppeteer from 'puppeteer'

/**
 * Puppeteer browser launcher
 *
 * @returns {Promise<import('puppeteer').Browser>} Puppeteer browser object
 */
export async function launch () {
  await download()

  // Open browser
  return puppeteer.launch({ headless: 'new' })
}

/**
 * Send screenshots in concurrent batches to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshots () {
  const browser = await launch()
  const componentNames = await getComponentNames()
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
  const componentFiles = await getListing(packageNameToPath('govuk-frontend', `src/govuk/components/${componentName}`))

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
