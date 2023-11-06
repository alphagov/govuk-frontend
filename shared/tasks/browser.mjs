import { download } from '@govuk-frontend/helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from '@govuk-frontend/helpers/puppeteer'
import {
  getComponentFiles,
  getComponentNames,
  getExamples
} from '@govuk-frontend/lib/components'
import { filterPath } from '@govuk-frontend/lib/files'
import percySnapshot from '@percy/puppeteer'
import { waitForPercyIdle } from '@percy/sdk-utils'
import puppeteer from 'puppeteer'

/**
 * Puppeteer browser launcher
 *
 * @returns {Promise<import('puppeteer').Browser>} Puppeteer browser object
 */
export async function launch() {
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
export async function screenshots() {
  const browser = await launch()
  const componentNames = await getComponentNames()

  // Screenshot components
  for (const componentName of componentNames) {
    const componentExamples = await getExamples(componentName)

    // Screenshot "default" example
    await screenshotComponent(browser, componentName)

    // Screenshot "inverse" example
    if (Object.keys(componentExamples).includes('inverse')) {
      await screenshotComponent(browser, componentName, {
        exampleName: 'inverse'
      })
    }
  }

  // Screenshot specific component examples
  for (const [componentName, options] of /** @type {const} */ ([
    ['button', { exampleName: 'start' }],
    ['button', { exampleName: 'inverse-start' }],
    ['checkboxes', { exampleName: 'with-hints-on-items' }],
    ['checkboxes', { exampleName: 'small' }],
    ['details', { exampleName: 'expanded' }],
    ['pagination', { exampleName: 'with-prev-and-next-only' }],
    ['pagination', { exampleName: 'with-prev-and-next-only-and-labels' }],
    ['radios', { exampleName: 'with-hints-on-items' }],
    ['radios', { exampleName: 'small' }]
  ])) {
    await screenshotComponent(browser, componentName, options)
  }

  // Screenshot specific example pages
  for (const exampleName of ['text-alignment', 'typography']) {
    await screenshotExample(browser, exampleName)
  }

  // Close browser
  await browser.close()

  // Wait for Percy to finish
  return waitForPercyIdle()
}

/**
 * Send single component screenshots to Percy
 * for visual regression testing
 *
 * @param {import('puppeteer').Browser} browser - Puppeteer browser object
 * @param {string} componentName - Component name
 * @param {object} [options] - Component options
 * @param {string} options.exampleName - Example name
 * @returns {Promise<void>}
 */
export async function screenshotComponent(browser, componentName, options) {
  const componentFiles = await getComponentFiles(componentName)

  // Navigate to component
  const page = await goToComponent(browser, componentName, options)

  // Add optional example to screenshot name
  const screenshotName = options?.exampleName
    ? `${componentName} (${options.exampleName})`
    : componentName

  // Screenshot preview page (with JavaScript)
  await percySnapshot(page, `js: ${screenshotName}`)

  // Check for "JavaScript enabled" components
  if (componentFiles.some(filterPath([`**/${componentName}.mjs`]))) {
    await page.setJavaScriptEnabled(false)

    // Screenshot preview page (without JavaScript)
    await page.reload({ waitUntil: 'load' })
    await percySnapshot(page, `no-js: ${screenshotName}`)
  }

  // Close page
  return page.close()
}

/**
 * Send single example screenshot to Percy
 * for visual regression testing
 *
 * @param {import('puppeteer').Browser} browser - Puppeteer browser object
 * @param {string} exampleName - Component name
 * @returns {Promise<void>}
 */
export async function screenshotExample(browser, exampleName) {
  const page = await goToExample(browser, exampleName)

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
