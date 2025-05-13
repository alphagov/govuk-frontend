import { join } from 'path'

import percySnapshot from '@percy/puppeteer'
import { isPercyEnabled } from '@percy/sdk-utils'
import { paths } from 'govuk-frontend-config'
import { download } from 'govuk-frontend-helpers/jest/browser/download.mjs'
import { goToComponent, goToExample } from 'govuk-frontend-helpers/puppeteer'
import { filterPath, getDirectories, getListing } from 'govuk-frontend-lib/files'
import puppeteer from 'puppeteer'

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
  const rebrandedComponentNames = [
    'header',
    'footer',
    'cookie-banner'
  ]
  const extraComponentExamples = [
    {
      component: 'header',
      example: 'full-width-with-navigation'
    },
    {
      component: 'header',
      example: 'with-service-name-and-navigation'
    }
  ]

  // Screenshot stack
  const input = []

  // Add components to screenshot
  input.push(...componentNames.map((screenshotName) =>
    /** @type {const} */ ([screenshotComponent, screenshotName])))

  // Add examples to screenshot
  input.push(...exampleNames.map((screenshotName) =>
    /** @type {const} */ ([screenshotExample, screenshotName])))

  // Add rebranded components to screenshot
  input.push(...rebrandedComponentNames.map((screenshotName) =>
    /** @type {const} */ ([screenshotComponent, screenshotName, {
      screenshotName: `${screenshotName} (rebranded)`,
      queryParam: 'rebrandOverride=true'
    }])))

  // Add specific component examples to screenshot
  input.push(...extraComponentExamples.map((screenshotName) =>
    /** @type {const} */ ([screenshotComponent, screenshotName.component, {
      exampleName: screenshotName.example,
      screenshotName: `${screenshotName.component}/${screenshotName.example}`
    }])))

  // Repeat specific examples again with rebrand options
  input.push(...extraComponentExamples.map((screenshotName) =>
    /** @type {const} */ ([screenshotComponent, screenshotName.component, {
      exampleName: screenshotName.example,
      screenshotName: `${screenshotName.component}/${screenshotName.example} (rebranded)`,
      queryParam: 'rebrandOverride=true'
    }])))

  // Batch 4x concurrent screenshots
  while (input.length) {
    const batch = input.splice(0, 4)

    // Take screenshots
    const screenshotTasks = batch.map(async ([screenshotFn, screenshotName, options]) =>
      screenshotFn(await browser.newPage(), screenshotName, options))

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
 * @param {object} [options] - Optional extra options
 * @param {string} [options.screenshotName] - Name of screenshot (overrides default name)
 * @param {string} [options.queryParam] - Query param to pass to goToComponent
 * @param {string} [options.exampleName] - Component example to pass to goToComponent
 * @returns {Promise<void>}
 */
export async function screenshotComponent (page, componentName, options) {
  const componentFiles = await getListing(join(paths.src, 'govuk/components', componentName))

  // Navigate to component
  await goToComponent(page, componentName, {
    queryParam: options?.queryParam,
    exampleName: options?.exampleName
  })

  // Screenshot preview page (with JavaScript)
  await percySnapshot(page, `js: ${options?.screenshotName ?? componentName}`)

  // Check for "JavaScript enabled" components
  if (componentFiles.some(filterPath([`**/${componentName}.mjs`]))) {
    await page.setJavaScriptEnabled(false)

    // Screenshot preview page (without JavaScript)
    await page.reload({ waitUntil: 'load' })
    await percySnapshot(page, `no-js: ${options?.screenshotName ?? componentName}`)
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

  await page.reload({ waitUntil: 'load' })

  // Remove feature flag banner
  await page.evaluate(() => {
    const featureFlagBanner = document.querySelector('.app-feature-flag-banner')

    if (featureFlagBanner) {
      featureFlagBanner.remove()
    }
  })

  // Screenshot preview page
  await percySnapshot(page, `js: ${exampleName} (example)`)

  // Close page
  return page.close()
}
