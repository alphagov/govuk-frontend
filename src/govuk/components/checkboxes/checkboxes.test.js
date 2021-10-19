/* eslint-env jest */

const cheerio = require('cheerio')

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

const goToAndGetComponent = async (name, example) => {
  const componentPath = `${baseUrl}/components/${name}/${example}/preview`
  await page.goto(componentPath, { waitUntil: 'load' })
  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)
  return $
}

const waitForHiddenSelector = async (selector) => {
  return page.waitForSelector(selector, {
    hidden: true,
    timeout: 1000
  })
}

const waitForVisibleSelector = async (selector) => {
  return page.waitForSelector(selector, {
    visible: true,
    timeout: 1000
  })
}

describe('Checkboxes with conditional reveals', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('has no ARIA attributes applied', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-items')
      const $component = $('.govuk-checkboxes')

      const hasAriaExpanded = $component.find('.govuk-checkboxes__input[aria-expanded]').length
      const hasAriaControls = $component.find('.govuk-checkboxes__input[aria-controls]').length

      expect(hasAriaExpanded).toBeFalsy()
      expect(hasAriaControls).toBeFalsy()
    })

    it('falls back to making all conditional content visible', async () => {
      await goToAndGetComponent('checkboxes', 'with-conditional-items')

      const isContentVisible = await waitForVisibleSelector('.govuk-checkboxes__conditional')
      expect(isContentVisible).toBeTruthy()
    })
  })

  describe('when JavaScript is available', () => {
    it('has conditional content revealed that is associated with a checked input', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-item-checked')
      const $component = $('.govuk-checkboxes')
      const $checkedInput = $component.find('.govuk-checkboxes__input:checked')
      const inputAriaControls = $checkedInput.attr('aria-controls')

      const isContentVisible = await waitForVisibleSelector(`[id="${inputAriaControls}"]:not(.govuk-checkboxes__conditional--hidden)`)
      expect(isContentVisible).toBeTruthy()
    })

    it('has no conditional content revealed that is associated with an unchecked input', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-item-checked')
      const $component = $('.govuk-checkboxes')
      const $uncheckedInput = $component.find('.govuk-checkboxes__item').last().find('.govuk-checkboxes__input')
      const uncheckedInputAriaControls = $uncheckedInput.attr('aria-controls')

      const isContentHidden = await waitForHiddenSelector(`[id="${uncheckedInputAriaControls}"].govuk-checkboxes__conditional--hidden`)
      expect(isContentHidden).toBeTruthy()
    })

    it('indicates when conditional content is collapsed or revealed', async () => {
      await goToAndGetComponent('checkboxes', 'with-conditional-items')

      const isNotExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=false]')
      expect(isNotExpanded).toBeTruthy()

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isExpanded = await waitForVisibleSelector('.govuk-checkboxes__item:first-child .govuk-checkboxes__input[aria-expanded=true]')
      expect(isExpanded).toBeTruthy()
    })

    it('toggles the conditional content when clicking an input', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-items')
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isContentVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentVisible).toBeTruthy()

      await page.click('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')

      const isContentHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentHidden).toBeTruthy()
    })

    it('toggles the conditional content when using an input with a keyboard', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-conditional-items')
      const $component = $('.govuk-checkboxes')
      const $firstInput = $component.find('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.focus('.govuk-checkboxes__item:first-child .govuk-checkboxes__input')
      await page.keyboard.press('Space')

      const isContentVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentVisible).toBeTruthy()

      await page.keyboard.press('Space')

      const isContentHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentHidden).toBeTruthy()
    })

    it('does not error when ID of revealed content contains special characters', async () => {
      // Errors logged to the console will cause this test to fail
      await goToAndGetComponent('checkboxes', 'with-conditional-items-with-special-characters')
    })
  })
})

describe('Checkboxes with a None checkbox', () => {
  describe('when JavaScript is available', () => {
    it('unchecks other checkboxes when the None checkbox is checked', async () => {
      await goToAndGetComponent('checkboxes', 'with-divider-and-None')

      // Check the first 3 checkboxes
      await page.click('#with-divider-and-none')
      await page.click('#with-divider-and-none-2')
      await page.click('#with-divider-and-none-3')

      // Check the None checkbox
      await page.click('#with-divider-and-none-5')

      // Expect first 3 checkboxes to have been unchecked
      const firstCheckboxIsUnchecked = await waitForVisibleSelector('[id="with-divider-and-none"]:not(:checked)')
      expect(firstCheckboxIsUnchecked).toBeTruthy()

      const secondCheckboxIsUnchecked = await waitForVisibleSelector('[id="with-divider-and-none-2"]:not(:checked)')
      expect(secondCheckboxIsUnchecked).toBeTruthy()

      const thirdCheckboxIsUnchecked = await waitForVisibleSelector('[id="with-divider-and-none-3"]:not(:checked)')
      expect(thirdCheckboxIsUnchecked).toBeTruthy()
    })

    it('unchecks the None checkbox when any other checkbox is checked', async () => {
      await goToAndGetComponent('checkboxes', 'with-divider-and-None')

      // Check the None checkbox
      await page.click('#with-divider-and-none-5')

      // Check the first checkbox
      await page.click('#with-divider-and-none')

      // Expect the None checkbox to have been unchecked
      const noneCheckboxIsUnchecked = await waitForVisibleSelector('[id="with-divider-and-none-5"]:not(:checked)')
      expect(noneCheckboxIsUnchecked).toBeTruthy()
    })
  })
})

describe('Checkboxes with a None checkbox and conditional reveals', () => {
  describe('when JavaScript is available', () => {
    it('unchecks other checkboxes and hides conditional reveals when the None checkbox is checked', async () => {
      const $ = await goToAndGetComponent('checkboxes', 'with-divider,-None-and-conditional-items')

      // Check the 4th checkbox, which reveals an additional field
      await page.click('#with-divider-and-none-and-conditional-items-4')

      const $checkedInput = $('#with-divider-and-none-and-conditional-items-4')
      const conditionalContentId = $checkedInput.attr('aria-controls')

      // Expect conditional content to have been revealed
      const isConditionalContentVisible = await waitForVisibleSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentVisible).toBeTruthy()

      // Check the None checkbox
      await page.click('#with-divider-and-none-and-conditional-items-6')

      // Expect the 4th checkbox to have been unchecked
      const forthCheckboxIsUnchecked = await waitForVisibleSelector('[id="with-divider-and-none-and-conditional-items-4"]:not(:checked)')
      expect(forthCheckboxIsUnchecked).toBeTruthy()

      // Expect conditional content to have been hidden
      const isConditionalContentHidden = await waitForHiddenSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentHidden).toBeTruthy()
    })
  })
})

describe('Checkboxes with multiple groups and a None checkbox and conditional reveals', () => {
  describe('when JavaScript is available', () => {
    it('none checkbox unchecks other checkboxes in other groups', async () => {
      await page.goto(`${baseUrl}/examples/conditional-reveals`)

      // Check some checkboxes in the first and second groups
      await page.click('#colour-primary-3')
      await page.click('#colour-secondary-2')

      // Check the None checkbox in the third group
      await page.click('#colour-other-3')

      // Expect the checkboxes in the first and second groups to be unchecked
      const firstCheckboxIsUnchecked = await waitForVisibleSelector('[id="colour-primary-3"]:not(:checked)')
      expect(firstCheckboxIsUnchecked).toBeTruthy()

      const secondCheckboxIsUnchecked = await waitForVisibleSelector('[id="colour-secondary-2"]:not(:checked)')
      expect(secondCheckboxIsUnchecked).toBeTruthy()
    })

    it('hides conditional reveals in other groups', async () => {
      await page.goto(`${baseUrl}/examples/conditional-reveals`)

      // Check the second checkbox in the first group, which reveals additional content
      await page.click('#colour-primary-2')

      const conditionalContentId = await page.evaluate(
        'document.getElementById("colour-primary-2").getAttribute("aria-controls")'
      )

      // Assert that conditional reveal is visible
      const isConditionalContentVisible = await waitForVisibleSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentVisible).toBeTruthy()

      // Check the None checkbox
      await page.click('#colour-other-3')

      // Assert that the second checkbox in the first group is unchecked
      const otherCheckboxIsUnchecked = await waitForVisibleSelector('[id="colour-primary-2"]:not(:checked)')
      expect(otherCheckboxIsUnchecked).toBeTruthy()

      // Expect conditional content to have been hidden
      const isConditionalContentHidden = await waitForHiddenSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentHidden).toBeTruthy()
    })
  })
})
