/**
 * @jest-environment puppeteer
 */

const cheerio = require('cheerio')

const { goToComponent, goToExample } = require('../../../../lib/puppeteer-helpers.js')

describe('Checkboxes with conditional reveals', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('has no ARIA attributes applied', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))
      const $component = $('.govuk-checkboxes')

      const hasAriaExpanded = $component.find('.govuk-checkboxes__input[aria-expanded]').length
      const hasAriaControls = $component.find('.govuk-checkboxes__input[aria-controls]').length

      expect(hasAriaExpanded).toBeFalsy()
      expect(hasAriaControls).toBeFalsy()
    })

    it('falls back to making all conditional content visible', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items'
      })

      const isContentVisible = await page.waitForSelector('.govuk-checkboxes__conditional', { visible: true })
      expect(isContentVisible).toBeTruthy()
    })
  })

  describe('when JavaScript is available', () => {
    it('has conditional content revealed that is associated with a checked input', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-item-checked'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))
      const $component = $('.govuk-checkboxes')
      const $checkedInput = $component.find('.govuk-checkboxes__input:checked')
      const inputAriaControls = $checkedInput.attr('aria-controls')

      const isContentVisible = await page.waitForSelector(`[id="${inputAriaControls}"]:not(.govuk-checkboxes__conditional--hidden)`, { visible: true })
      expect(isContentVisible).toBeTruthy()
    })

    it('has no conditional content revealed that is associated with an unchecked input', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-item-checked'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))
      const $component = $('.govuk-checkboxes')
      const $uncheckedInput = $component.find('.govuk-checkboxes__item').last().find('.govuk-checkboxes__input')
      const uncheckedInputAriaControls = $uncheckedInput.attr('aria-controls')

      const isContentHidden = await page.waitForSelector(`[id="${uncheckedInputAriaControls}"].govuk-checkboxes__conditional--hidden`, { hidden: true })
      expect(isContentHidden).toBeTruthy()
    })

    it('indicates when conditional content is collapsed or revealed', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items'
      })

      const isNotExpanded = await page.waitForSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=false]', { visible: true })
      expect(isNotExpanded).toBeTruthy()

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isExpanded = await page.waitForSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=true]', { visible: true })
      expect(isExpanded).toBeTruthy()
    })

    it('toggles the conditional content when clicking an input', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isContentVisible = await page.waitForSelector(`[id="${firstInputAriaControls}"]`, { visible: true })
      expect(isContentVisible).toBeTruthy()

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isContentHidden = await page.waitForSelector(`[id="${firstInputAriaControls}"]`, { hidden: true })
      expect(isContentHidden).toBeTruthy()
    })

    it('toggles the conditional content when using an input with a keyboard', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.focus('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      await page.keyboard.press('Space')

      const isContentVisible = await page.waitForSelector(`[id="${firstInputAriaControls}"]`, { visible: true })
      expect(isContentVisible).toBeTruthy()

      await page.keyboard.press('Space')

      const isContentHidden = await page.waitForSelector(`[id="${firstInputAriaControls}"]`, { hidden: true })
      expect(isContentHidden).toBeTruthy()
    })

    it('does not error when ID of revealed content contains special characters', async () => {
      // Errors logged to the console will cause this test to fail
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-conditional-items-with-special-characters'
      })
      cheerio.load(await page.evaluate(() => document.body.innerHTML))
    })
  })
})

describe('Checkboxes with a None checkbox', () => {
  describe('when JavaScript is available', () => {
    beforeEach(async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-divider-and-None'
      })
    })

    it('unchecks other checkboxes when the None checkbox is checked', async () => {
      // Check the first 3 checkboxes
      await page.click('#with-divider-and-none')
      await page.click('#with-divider-and-none-2')
      await page.click('#with-divider-and-none-3')

      // Check the None checkbox
      await page.click('#with-divider-and-none-5')

      // Expect first 3 checkboxes to have been unchecked
      const firstCheckboxIsUnchecked = await page.waitForSelector('[id="with-divider-and-none"]:not(:checked)', { visible: true })
      expect(firstCheckboxIsUnchecked).toBeTruthy()

      const secondCheckboxIsUnchecked = await page.waitForSelector('[id="with-divider-and-none-2"]:not(:checked)', { visible: true })
      expect(secondCheckboxIsUnchecked).toBeTruthy()

      const thirdCheckboxIsUnchecked = await page.waitForSelector('[id="with-divider-and-none-3"]:not(:checked)', { visible: true })
      expect(thirdCheckboxIsUnchecked).toBeTruthy()
    })

    it('unchecks the None checkbox when any other checkbox is checked', async () => {
      // Check the None checkbox
      await page.click('#with-divider-and-none-5')

      // Check the first checkbox
      await page.click('#with-divider-and-none')

      // Expect the None checkbox to have been unchecked
      const noneCheckboxIsUnchecked = await page.waitForSelector('[id="with-divider-and-none-5"]:not(:checked)', { visible: true })
      expect(noneCheckboxIsUnchecked).toBeTruthy()
    })
  })
})

describe('Checkboxes with a None checkbox and conditional reveals', () => {
  describe('when JavaScript is available', () => {
    it('unchecks other checkboxes and hides conditional reveals when the None checkbox is checked', async () => {
      await goToComponent(page, 'checkboxes', {
        exampleName: 'with-divider,-None-and-conditional-items'
      })

      const $ = cheerio.load(await page.evaluate(() => document.body.innerHTML))

      // Check the 4th checkbox, which reveals an additional field
      await page.click('#with-divider-and-none-and-conditional-items-4')

      const $checkedInput = $('#with-divider-and-none-and-conditional-items-4')
      const conditionalContentId = $checkedInput.attr('aria-controls')

      // Expect conditional content to have been revealed
      const isConditionalContentVisible = await page.waitForSelector(`[id="${conditionalContentId}"]`, { visible: true })
      expect(isConditionalContentVisible).toBeTruthy()

      // Check the None checkbox
      await page.click('#with-divider-and-none-and-conditional-items-6')

      // Expect the 4th checkbox to have been unchecked
      const forthCheckboxIsUnchecked = await page.waitForSelector('[id="with-divider-and-none-and-conditional-items-4"]:not(:checked)', { visible: true })
      expect(forthCheckboxIsUnchecked).toBeTruthy()

      // Expect conditional content to have been hidden
      const isConditionalContentHidden = await page.waitForSelector(`[id="${conditionalContentId}"]`, { hidden: true })
      expect(isConditionalContentHidden).toBeTruthy()
    })
  })
})

describe('Checkboxes with multiple groups and a None checkbox and conditional reveals', () => {
  describe('when JavaScript is available', () => {
    beforeEach(async () => {
      await goToExample(page, 'conditional-reveals')
    })

    it('none checkbox unchecks other checkboxes in other groups', async () => {
      // Check some checkboxes in the first and second groups
      await page.click('#colour-primary-3')
      await page.click('#colour-secondary-2')

      // Check the None checkbox in the third group
      await page.click('#colour-other-3')

      // Expect the checkboxes in the first and second groups to be unchecked
      const firstCheckboxIsUnchecked = await page.waitForSelector('[id="colour-primary-3"]:not(:checked)', { visible: true })
      expect(firstCheckboxIsUnchecked).toBeTruthy()

      const secondCheckboxIsUnchecked = await page.waitForSelector('[id="colour-secondary-2"]:not(:checked)', { visible: true })
      expect(secondCheckboxIsUnchecked).toBeTruthy()
    })

    it('hides conditional reveals in other groups', async () => {
      // Check the second checkbox in the first group, which reveals additional content
      await page.click('#colour-primary-2')

      const conditionalContentId = await page.evaluate(
        'document.getElementById("colour-primary-2").getAttribute("aria-controls")'
      )

      // Assert that conditional reveal is visible
      const isConditionalContentVisible = await page.waitForSelector(`[id="${conditionalContentId}"]`, { visible: true })
      expect(isConditionalContentVisible).toBeTruthy()

      // Check the None checkbox
      await page.click('#colour-other-3')

      // Assert that the second checkbox in the first group is unchecked
      const otherCheckboxIsUnchecked = await page.waitForSelector('[id="colour-primary-2"]:not(:checked)', { visible: true })
      expect(otherCheckboxIsUnchecked).toBeTruthy()

      // Expect conditional content to have been hidden
      const isConditionalContentHidden = await page.waitForSelector(`[id="${conditionalContentId}"]`, { hidden: true })
      expect(isConditionalContentHidden).toBeTruthy()
    })
  })
})
