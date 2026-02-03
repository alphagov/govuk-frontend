import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { download } from '@govuk-frontend/helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from '@govuk-frontend/helpers/puppeteer'
import { getComponentNames, getExamples } from '@govuk-frontend/lib/components'
import { getListing, getYaml } from '@govuk-frontend/lib/files'
import percySnapshot from '@percy/puppeteer'
import { launch } from 'puppeteer'

/**
 * Send screenshots in concurrent batches to Percy
 * for visual regression testing
 *
 * @returns {Promise<void>}
 */
export async function screenshots() {
  await download()

  const browser = await launch({ headless: true })
  const componentNames = await getComponentNames()

  // Screenshot components
  for (const componentName of componentNames) {
    const allExamples = await getExamples(componentName)

    for (const exampleName of Object.keys(allExamples)) {
      if (allExamples[exampleName].fixture.screenshot) {
        await screenshotComponent(browser, componentName, {
          screenshot: allExamples[exampleName].fixture.screenshot,
          exampleName
        })
      }
    }
  }

  // Screenshot non component examples
  const nonComponentExamples = await getListing(
    join(paths.app, 'src/views/examples/**/*.yaml')
  )

  for (const examplePath of nonComponentExamples) {
    const exampleConfig = await getYaml(join(paths.root, examplePath))
    const exampleName = examplePath
      .split('/')
      .pop()
      .replace(/\.yaml$/, '')
    if (exampleConfig.screenshot) {
      await screenshotExample(browser, exampleName)
    }
  }

  // Close browser
  await browser.close()
}

/**
 * Current screenshot variants include:
 *
 * - `default` - Default screenshot with JavaScript enabled
 * - `no-js` - Screenshot with JavaScript disabled
 *
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
  const snapshotOptions = {
    scope: '.app-whitespace-highlight',
    labels: componentName
  }

  // Navigate to component
  const page = await goToComponent(browser, componentName, options)

  const printExampleName =
    options.exampleName === 'default' ? '' : ` (${options.exampleName})`

  const screenshotName = `${componentName}${printExampleName}`

  // Disable JavaScript
  if (options.screenshot.variants?.includes('no-js')) {
    await percySnapshotNoJs(page, screenshotName, snapshotOptions)
  }

  // Default screenshot
  if (
    options.screenshot === true ||
    options.screenshot.variants?.includes('default')
  ) {
    await percySnapshot(page, `js: ${screenshotName}`, snapshotOptions)
    await page.setViewport({ width: 600, height: 1000 })
    await percySnapshot(page, `js-600w: ${screenshotName}`, snapshotOptions)
  }

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
  await percySnapshot(page, screenshotName, {
    ...snapShotOptions,
    labels: `${snapShotOptions.labels}, No-JS`
  })
  await page.setJavaScriptEnabled(true)
  await page.reload({ waitUntil: 'load' })
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
    scope: '.govuk-main-wrapper',
    labels: 'Examples'
  })

  // Close page
  return page.close()
}

/**
 * @import { Browser, Page } from 'puppeteer'
 * @import { SnapshotOptions } from '@percy/core'
 */
