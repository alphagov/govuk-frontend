import {
  getAttribute,
  goToExample,
  isVisible
} from '@govuk-frontend/helpers/puppeteer'

describe('Example: Multiple radio groups', () => {
  /** @type {globalThis.page} */
  let page

  let $inputsWarm
  let $inputsCool
  let $inputsNotInForm

  beforeEach(async () => {
    page = await goToExample(browser, 'multiple-radio-groups')

    $inputsWarm = await page.$$('.govuk-radios__input[id^="warm"]')
    $inputsCool = await page.$$('.govuk-radios__input[id^="cool"]')
    $inputsNotInForm = await page.$$(
      '.govuk-radios__input[id^="question-not-in-form"]'
    )
  })

  it('toggles conditional reveals in other groups', async () => {
    const $conditionalWarm = await page.$(
      `[id="${await getAttribute($inputsWarm[0], 'aria-controls')}"]`
    )
    const $conditionalCool = await page.$(
      `[id="${await getAttribute($inputsCool[0], 'aria-controls')}"]`
    )

    // Select red in warm colours
    await $inputsWarm[0].click()

    expect(await isVisible($conditionalWarm)).toBe(true)
    expect(await isVisible($conditionalCool)).toBe(false)

    // Select blue in cool colours
    await $inputsCool[0].click()

    expect(await isVisible($conditionalWarm)).toBe(false)
    expect(await isVisible($conditionalCool)).toBe(true)
  })

  it('toggles conditional reveals when not in a form', async () => {
    const $conditionalWarm = await page.$(
      `[id="${await getAttribute($inputsWarm[0], 'aria-controls')}"]`
    )

    // Select first input in radios not in a form
    await $inputsNotInForm[0].click()

    expect(await isVisible($conditionalWarm)).toBe(false)
  })
})
