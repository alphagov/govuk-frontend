import { download } from '@govuk-frontend/helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from '@govuk-frontend/helpers/puppeteer'
import { getComponentNames, getExamples } from '@govuk-frontend/lib/components'
import percySnapshot from '@percy/puppeteer'
import puppeteer from 'puppeteer'

/**
 * Puppeteer browser launcher
 *
 * @returns {Promise<Browser>} Puppeteer browser object
 */
export async function launch() {
  await download()

  // Open browser
  return puppeteer.launch({ headless: true })
}

/**
 * Send screenshots in concurrent batches to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshots() {
  const browser = await launch()
  const componentNames = await getComponentNames()

  // Screenshot components
  for (const componentName of componentNames) {
    const allExamples = await getExamples(componentName)
    const componentExampleNames = Object.keys(allExamples).filter(
      (key) => allExamples[key].fixture.screenshot
    )

    for (const exampleName of componentExampleNames) {
      await screenshotComponent(browser, componentName, {
        screenshot: allExamples[exampleName].fixture.screenshot,
        exampleName
      })
    }
  }

  // Screenshot specific example pages
  for (const exampleName of ['text-alignment', 'typography']) {
    await screenshotExample(browser, exampleName)
  }

  // Close browser
  await browser.close()
}

/**
 * @overload
 * @param {Browser} browser - Puppeteer browser object
 * @param {string} componentName - Component name
 * @param {object} options - Component options
 * @param {string} options.exampleName - Example name
 * @param {object} options.screenshot - Screenshot options
 * @param {Array} [options.screenshot.variants] - Screenshot variants
 */

/**
 * @overload
 * @param {Browser} browser - Puppeteer browser object
 * @param {string} componentName - Component name
 * @param {object} options - Component options
 * @param {string} options.exampleName - Example name
 * @param {boolean} options.screenshot - Whether to take a screenshot
 */

/**
 * Send single component screenshots to Percy
 * for visual regression testing
 *
 * @param {Browser} browser - Puppeteer browser object
 * @param {string} componentName - Component name
 * @param {object} options - Component options
 * @param {string} options.exampleName - Example name
 * @param {object | boolean} options.screenshot - Screenshot options
 * @returns {Promise<void>}
 */
export async function screenshotComponent(browser, componentName, options) {
  // Percy snapshot options
  // Scope is .app-whitespace-highlight rather than .govuk-main-wrapper like with
  // the examples so that margin that isn't part of the component doesn't get
  // included in the screenshot
  /** @type {SnapshotOptions} */
  const snapshotOptions = { scope: '.app-whitespace-highlight' }

  // Navigate to component
  const page = await goToComponent(browser, componentName, options)

  const screenshotName = `${componentName} (${options.exampleName})`

  if (options.screenshot.variants?.noJs) {
    await percySnapshotNoJs(page, screenshotName, snapshotOptions)
  }

  await percySnapshot(page, screenshotName, snapshotOptions)

  // Close page
  return page.close()
}

/**
 *
 * @param {Page} page - Puppeteer page object
 * @param {string} screenshotName - The name of the screenshot
 * @param {SnapshotOptions} snapShotOptions - Percy snapshot options
 */
export async function percySnapshotNoJs(page, screenshotName, snapShotOptions) {
  await page.setJavaScriptEnabled(false)
  await page.reload({ waitUntil: 'load' })
  screenshotName = `no-js: ${screenshotName}`
  await percySnapshot(page, screenshotName, snapShotOptions)
}

/**
 * Send single example screenshot to Percy
 * for visual regression testing
 *
 * @param {Browser} browser - Puppeteer browser object
 * @param {string} exampleName - Component name
 * @returns {Promise<void>}
 */
export async function screenshotExample(browser, exampleName) {
  const page = await goToExample(browser, exampleName)

  // Screenshot preview page
  await percySnapshot(page, `js: ${exampleName} (example)`, {
    scope: '.govuk-main-wrapper'
  })

  // Close page
  return page.close()
}

/**
 * @import { Browser, Page } from 'puppeteer'
 * @import { SnapshotOptions } from '@percy/core'
 */
