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

describe('Radios with conditional reveals', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('has no ARIA attributes applied', async () => {
      const $ = await goToAndGetComponent('radios', 'with-conditional-items')
      const $component = $('.govuk-radios')

      const hasAriaExpanded = $component.find('.govuk-radios__input[aria-expanded]').length
      const hasAriaControls = $component.find('.govuk-radios__input[aria-controls]').length

      expect(hasAriaExpanded).toBeFalsy()
      expect(hasAriaControls).toBeFalsy()
    })

    it('falls back to making all conditional content visible', async () => {
      await goToAndGetComponent('radios', 'with-conditional-items')

      const isContentVisible = await waitForVisibleSelector('.govuk-radios__conditional')
      expect(isContentVisible).toBeTruthy()
    })
  })
  describe('when JavaScript is available', () => {
    it('has conditional content revealed that is associated with a checked input', async () => {
      const $ = await goToAndGetComponent('radios', 'with-conditional-item-checked')
      const $component = $('.govuk-radios')
      const $checkedInput = $component.find('.govuk-radios__input:checked')
      const inputAriaControls = $checkedInput.attr('aria-controls')

      const isContentVisible = await waitForVisibleSelector(`[id="${inputAriaControls}"]:not(.govuk-radios__conditional--hidden)`)
      expect(isContentVisible).toBeTruthy()
    })

    it('has no conditional content revealed that is associated with an unchecked input', async () => {
      const $ = await goToAndGetComponent('radios', 'with-conditional-item-checked')
      const $component = $('.govuk-radios')
      const $uncheckedInput = $component.find('.govuk-radios__item').last().find('.govuk-radios__input')
      const uncheckedInputAriaControls = $uncheckedInput.attr('aria-controls')

      const isContentHidden = await waitForHiddenSelector(`[id="${uncheckedInputAriaControls}"].govuk-radios__conditional--hidden`)
      expect(isContentHidden).toBeTruthy()
    })

    it('indicates when conditional content is collapsed or revealed', async () => {
      await goToAndGetComponent('radios', 'with-conditional-items')

      const isNotExpanded = await waitForVisibleSelector('.govuk-radios__item:first-child .govuk-radios__input[aria-expanded=false]')
      expect(isNotExpanded).toBeTruthy()

      await page.click('.govuk-radios__item:first-child .govuk-radios__input')

      const isExpanded = await waitForVisibleSelector('.govuk-radios__item:first-child .govuk-radios__input[aria-expanded=true]')
      expect(isExpanded).toBeTruthy()
    })

    it('toggles the conditional content when clicking an input', async () => {
      const $ = await goToAndGetComponent('radios', 'with-conditional-items')
      const $component = $('.govuk-radios')
      const $firstInput = $component.find('.govuk-radios__item:first-child .govuk-radios__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.click('.govuk-radios__item:first-child .govuk-radios__input')

      const isContentVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentVisible).toBeTruthy()

      await page.click('.govuk-radios__item:nth-child(3) .govuk-radios__input')

      const isContentHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentHidden).toBeTruthy()
    })

    it('toggles the conditional content when using an input with a keyboard', async () => {
      const $ = await goToAndGetComponent('radios', 'with-conditional-items')
      const $component = $('.govuk-radios')
      const $firstInput = $component.find('.govuk-radios__item:first-child .govuk-radios__input')
      const firstInputAriaControls = $firstInput.attr('aria-controls')

      await page.focus('.govuk-radios__item:first-child .govuk-radios__input')
      await page.keyboard.press('Space')

      const isContentVisible = await waitForVisibleSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentVisible).toBeTruthy()

      await page.keyboard.press('ArrowRight')

      const isContentHidden = await waitForHiddenSelector(`[id="${firstInputAriaControls}"]`)
      expect(isContentHidden).toBeTruthy()
    })

    it('does not error when ID of revealed content contains special characters', async () => {
      // Errors logged to the console will cause this test to fail
      await goToAndGetComponent('radios', 'with-conditional-items-with-special-characters')
    })

    describe('with multiple radio groups on the same page', () => {
      it('toggles conditional reveals in other groups', async () => {
        await page.goto(baseUrl + '/examples/multiple-radio-groups', { waitUntil: 'load' })

        // Select red in warm colours
        await page.click('#warm')

        // Select blue in cool colours
        await page.click('#cool')

        const isWarmConditionalRevealHidden = await waitForHiddenSelector('#conditional-warm')
        expect(isWarmConditionalRevealHidden).toBeTruthy()
      })

      it('toggles conditional reveals when not in a form', async () => {
        await page.goto(baseUrl + '/examples/multiple-radio-groups', { waitUntil: 'load' })

        // Select first input in radios not in a form
        await page.click('#question-not-in-form')

        const isConditionalRevealVisible = await waitForVisibleSelector('#conditional-question-not-in-form')
        expect(isConditionalRevealVisible).toBeTruthy()
      })
    })
  })
})

describe('Radios with multiple groups and conditional reveals', () => {
  describe('when JavaScript is available', () => {
    it('hides conditional reveals in other groups', async () => {
      await page.goto(`${baseUrl}/examples/conditional-reveals`)

      // Choose the second radio in the first group, which reveals additional content
      await page.click('#fave-primary-2')

      const conditionalContentId = await page.evaluate(
        'document.getElementById("fave-primary-2").getAttribute("aria-controls")'
      )

      // Assert conditional reveal is visible
      const isConditionalContentVisible = await waitForVisibleSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentVisible).toBeTruthy()

      // Choose a different radio with the same name, but in a different group
      await page.click('#fave-other-3')

      // Expect conditional content to have been hidden
      const isConditionalContentHidden = await waitForHiddenSelector(`[id="${conditionalContentId}"]`)
      expect(isConditionalContentHidden).toBeTruthy()
    })
  })
})
