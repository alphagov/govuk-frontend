import { getProperty, goTo } from '@govuk-frontend/helpers/puppeteer'

describe('Full page examples', () => {
  describe.each([
    {
      title:
        '2018’s oddest requests from Brits abroad: ‘Strictly’, vampires and sausages',
      path: '/full-page-examples/announcements'
    },
    {
      title: 'UK bank holidays',
      path: '/full-page-examples/bank-holidays'
    },
    {
      title: 'Check your answers - Temporary events notice',
      path: '/full-page-examples/check-your-answers'
    },
    {
      title: 'Apply online for a UK passport',
      path: '/full-page-examples/start-page'
    }
  ])('$title', ({ title, path }) => {
    it('should load correctly', async () => {
      await goTo(page, path)

      const $title = await page.$('title')

      // Check the page responded correctly
      expect(getProperty($title, 'textContent')).resolves.toEqual(
        `${title} - GOV.UK`
      )
    })
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
      expect(getProperty($title, 'textContent')).resolves.toEqual(
        `${title} - GOV.UK`
      )

      // Check that the error summary is not visible
      expect(page.$('[data-module="govuk-error-summary"]')).resolves.toBeFalsy()
    })

    it('should show errors if submitted without input', async () => {
      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ])

      const $title = await page.$('title')

      // Check the page responded with an error
      expect(getProperty($title, 'textContent')).resolves.toEqual(
        `Error: ${title} - GOV.UK`
      )

      // Check that the error summary is visible
      expect(
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
      expect(getProperty($summary, 'textContent')).resolves.toContain(
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
      expect(getProperty($summary, 'textContent')).resolves.toContain(
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
      expect(getProperty($summary, 'textContent')).resolves.toContain(
        '128,421 results'
      )
    })
  })
})
