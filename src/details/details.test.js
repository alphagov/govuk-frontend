/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('/components/details', () => {
  describe('/components/details/preview', () => {
    it('should add to summary the button role', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const summaryRole = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('role'))
      expect(summaryRole).toBe('button')
    })

    it('should set the element controlled by the summary using aria-controls', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const summaryAriaControls = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('aria-controls'))
      expect(summaryAriaControls).toBe('details-content-0')
    })

    it('should set the expanded state of the summary to false using aria-expanded', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const summaryAriaExpanded = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('aria-expanded'))
      expect(summaryAriaExpanded).toBe('false')
    })

    it('should add a unique id to the hidden content in order to be controlled by the summary', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const hiddenContainerId = await page.evaluate(() => document.body.getElementsByTagName('details')[0].querySelectorAll('div')[0].getAttribute('id'))
      expect(hiddenContainerId).toBe('details-content-0')
    })

    it('should present the content as hidden using aria-hidden', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const hiddenContainerAriaHidden = await page.evaluate(() => document.body.getElementsByTagName('details')[0].querySelectorAll('div')[0].getAttribute('aria-hidden'))
      expect(hiddenContainerAriaHidden).toBe('true')
    })

    it('should indicate the open state of the content', async () => {
      await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

      const detailsOpen = await page.evaluate(() => document.body.getElementsByTagName('details')[0].getAttribute('open'))
      expect(detailsOpen).toBeNull()
    })

    describe('when details is triggered', () => {
      it('should indicate the expanded state of the summary using aria-expanded', async () => {
        await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

        await page.click('summary')

        const summaryAriaExpanded = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('aria-expanded'))
        expect(summaryAriaExpanded).toBe('true')
      })

      it('should indicate the visible state of the content using aria-hidden', async () => {
        await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

        await page.click('summary')

        const hiddenContainerAriaHidden = await page.evaluate(() => document.body.getElementsByTagName('details')[0].querySelectorAll('div')[0].getAttribute('aria-hidden'))
        expect(hiddenContainerAriaHidden).toBe('false')
      })

      it('should indicate the open state of the content', async () => {
        await page.goto(baseUrl + '/components/details/preview', { waitUntil: 'load' })

        await page.click('summary')

        const detailsOpen = await page.evaluate(() => document.body.getElementsByTagName('details')[0].getAttribute('open'))
        expect(detailsOpen).not.toBeNull()
      })
    })
  })

  describe('/components/details/expanded/preview', () => {
    it('should indicate the expanded state of the summary using aria-expanded', async () => {
      await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

      const summaryAriaExpanded = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('aria-expanded'))
      expect(summaryAriaExpanded).toBe('true')
    })

    it('should indicate the visible state of the content using aria-hidden', async () => {
      await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

      const hiddenContainerAriaHidden = await page.evaluate(() => document.body.getElementsByTagName('details')[0].querySelectorAll('div')[0].getAttribute('aria-hidden'))
      expect(hiddenContainerAriaHidden).toBe('false')
    })

    it('should indicate the open state of the content', async () => {
      await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

      const detailsOpen = await page.evaluate(() => document.body.getElementsByTagName('details')[0].getAttribute('open'))
      expect(detailsOpen).not.toBeNull()
    })

    describe('when details is triggered', () => {
      it('should indicate the expanded state of the summary using aria-expanded', async () => {
        await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

        await page.click('summary')

        const summaryAriaExpanded = await page.evaluate(() => document.body.getElementsByTagName('summary')[0].getAttribute('aria-expanded'))
        expect(summaryAriaExpanded).toBe('false')
      })

      it('should indicate the visible state of the content using aria-hidden', async () => {
        await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

        await page.click('summary')

        const hiddenContainerAriaHidden = await page.evaluate(() => document.body.getElementsByTagName('details')[0].querySelectorAll('div')[0].getAttribute('aria-hidden'))
        expect(hiddenContainerAriaHidden).toBe('true')
      })

      it('should indicate the open state of the content', async () => {
        await page.goto(baseUrl + '/components/details/expanded/preview', { waitUntil: 'load' })

        await page.click('summary')

        const detailsOpen = await page.evaluate(() => document.body.getElementsByTagName('details')[0].getAttribute('open'))
        expect(detailsOpen).toBeNull()
      })
    })
  })
})
