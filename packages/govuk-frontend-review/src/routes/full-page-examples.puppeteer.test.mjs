import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { getProperty, goTo } from '@govuk-frontend/helpers/puppeteer'
import { getDirectories } from '@govuk-frontend/lib/files'

import { getFullPageExamples } from '../common/lib/files.mjs'

describe('Full page examples', () => {
  it('should load correctly', async () => {
    const exampleNamesFullPage = await getDirectories(
      join(paths.app, 'src/views/full-page-examples')
    )

    // Full page examples have additional context
    const fullPageExamples = await getFullPageExamples()

    // Check the page responded correctly
    for (const exampleName of exampleNamesFullPage) {
      await goTo(page, `/full-page-examples/${exampleName}`)

      // Look for full page example context
      const example = fullPageExamples.find(
        (example) => example.path === exampleName
      )

      // Find title text
      const $title = await page.$('title')
      const titleText = await getProperty($title, 'textContent')

      // Check for matching title
      expect(titleText).toEqual(`${example.title} - GOV.UK`)
    }
  })
})

describe('Full page examples (with form submit)', () => {
  describe.each([
    {
      title: 'Send your feedback - Verify',
      path: '/full-page-examples/feedback'
    },
    {
      title: 'Have you changed your name?',
      path: '/full-page-examples/have-you-changed-your-name'
    },
    {
      title: 'How do you want to sign in?',
      path: '/full-page-examples/how-do-you-want-to-sign-in'
    },
    {
      title: 'Passport details',
      path: '/full-page-examples/passport-details'
    },
    {
      title: 'Update your account details',
      path: '/full-page-examples/update-your-account-details'
    },
    {
      title: 'Upload your photo',
      path: '/full-page-examples/upload-your-photo'
    },
    {
      title: 'What is your home address?',
      path: '/full-page-examples/what-is-your-address'
    },
    {
      title: 'What is your nationality?',
      path: '/full-page-examples/what-is-your-nationality'
    },
    {
      title: 'What is your home postcode?',
      path: '/full-page-examples/what-is-your-postcode'
    },
    {
      title: 'What was the last country you visited?',
      path: '/full-page-examples/what-was-the-last-country-you-visited'
    }
  ])('$title', ({ title, path }) => {
    beforeAll(async () => {
      await goTo(page, path)
    })

    it('should not show errors', async () => {
      const $title = await page.$('title')

      // Check the page responded correctly
      await expect(getProperty($title, 'textContent')).resolves.toEqual(
        `${title} - GOV.UK`
      )

      // Check that the error summary is not visible
      await expect(
        page.$('[data-module="govuk-error-summary"]')
      ).resolves.toBeFalsy()
    })

    it('should show errors if submitted without input', async () => {
      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ])

      const $title = await page.$('title')

      // Check the page responded with an error
      await expect(getProperty($title, 'textContent')).resolves.toEqual(
        `Error: ${title} - GOV.UK`
      )

      // Check that the error summary is visible
      await expect(
        page.$('[data-module="govuk-error-summary"]')
      ).resolves.toBeTruthy()
    })
  })

  describe('Search', () => {
    beforeAll(async () => {
      await goTo(page, '/full-page-examples/search')
    })

    it('should show most wanted results by default', async () => {
      const $summary = await page.$('.app-search-results-summary')

      // Check the results are correct
      await expect(getProperty($summary, 'textContent')).resolves.toContain(
        '482,211 results'
      )
    })

    it('should show sorted results when selected', async () => {
      await page.select('.govuk-select[name="order"]', 'updated-newest')

      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ])

      const $summary = await page.$('.app-search-results-summary')

      // Check the results are correct
      await expect(getProperty($summary, 'textContent')).resolves.toContain(
        '221,418 results'
      )
    })

    it('should show organisation results when selected', async () => {
      await page.select('.govuk-select[name="order"]', 'updated-newest')
      await page.click('.govuk-checkboxes__input[value="hmrc"]')

      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ])

      const $summary = await page.$('.app-search-results-summary')

      // Check the results are correct
      await expect(getProperty($summary, 'textContent')).resolves.toContain(
        '128,421 results'
      )
    })
  })
})
