import { download } from '@govuk-frontend/helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from '@govuk-frontend/helpers/puppeteer'
import {
  getComponentFiles,
  getComponentNames,
  getExamples
} from '@govuk-frontend/lib/components'
import { filterPath } from '@govuk-frontend/lib/files'
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
    const componentExamples = await getExamples(componentName)

    // Screenshot "default" example
    await screenshotComponent(browser, componentName)

    // Screenshot any other examples with 'screenshot: true'
    const otherExamples = Object.keys(componentExamples).filter(
      (key) => componentExamples[key].fixture.screenshot
    )

    for (const exampleName of otherExamples) {
      await screenshotComponent(browser, componentName, {
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
 * Send single component screenshots to Percy
 * for visual regression testing
 *
 * @param {Browser} browser - Puppeteer browser object
 * @param {string} componentName - Component name
 * @param {object} [options] - Component options
 * @param {string} options.exampleName - Example name
 * @returns {Promise<void>}
 */
export async function screenshotComponent(browser, componentName, options) {
  const componentFiles = await getComponentFiles(componentName)

  // Percy snapshot options
  // Scope is .app-wihtespace-highlight rather than .govuk-main-wrapper like with
  // the examples so that margin that isn't part of the component doesn't get
  // included in the screenshot
  /** @type {SnapshotOptions} */
  const snapshotOptions = { scope: '.app-whitespace-highlight' }

  // Navigate to component
  const page = await goToComponent(browser, componentName, options)

  // Add optional example to screenshot name
  const screenshotName = options?.exampleName
    ? `${componentName} (${options.exampleName})`
    : componentName

  // Screenshot preview page (with JavaScript)
  await percySnapshot(page, `js: ${screenshotName}`, snapshotOptions)

  // Check for "JavaScript enabled" components
  if (componentFiles.some(filterPath([`**/${componentName}.mjs`]))) {
    await page.setJavaScriptEnabled(false)

    // Screenshot preview page (without JavaScript)
    await page.reload({ waitUntil: 'load' })
    await percySnapshot(page, `no-js: ${screenshotName}`, snapshotOptions)
  }

  // Close page
  return page.close()
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
 * @import { Browser } from 'puppeteer'
 * @import { SnapshotOptions } from '@percy/core'
 */
