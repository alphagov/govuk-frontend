/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import Accordion from './accordion'

let accordionHTML = false

beforeEach(() => {
  accordionHTML = document.createElement('div')
  accordionHTML.setAttribute('class', 'govuk-accordion')
  accordionHTML.setAttribute('id', 'accordion-example')
  accordionHTML.setAttribute('data-module', 'govuk-accordion')

  const accordionSection = document.createElement('div')
  accordionSection.setAttribute('class', 'govuk-accordion__section')

  const accordionSectionHeader = document.createElement('div')
  accordionSection.setAttribute('class', 'govuk-accordion__section-header')

  const accordionSectionHeading = document.createElement('div')
  accordionSectionHeading.setAttribute('class', 'govuk-accordion__section-heading')

  const accordionSectionButton = document.createElement('span')
  accordionSectionButton.setAttribute('id', 'accordion-example-heading-1')
  accordionSectionButton.setAttribute('class', 'govuk-accordion__section-button')
  accordionSectionButton.innerText = 'This is a heading'

  const accordionSectionContent = document.createElement('div')
  accordionSectionContent.setAttribute('id', 'accordion-example-content-1')
  accordionSectionContent.setAttribute('class', 'govuk-accordion__section-content')
  accordionSectionContent.setAttribute('aria-labelledby', 'accordion-example-heading-1')

  const accordionContent = document.createElement('p')
  accordionContent.innerText = 'This is some content'

  accordionSectionContent.appendChild(accordionContent)

  accordionSectionHeading.appendChild(accordionSectionButton)
  accordionSectionHeader.appendChild(accordionSectionHeading)

  accordionSection.appendChild(accordionSectionHeader)
  accordionSection.appendChild(accordionContent)

  accordionHTML.appendChild(accordionSection)
  document.body.appendChild(accordionHTML)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('with translations', () => {
  let i18n = {}

  beforeEach(() => {
    i18n = {
      i18n: {
        locale: 'cy',
        translations: {
          show_all_sections: 'Embiggen all sections'
        }
      }
    }
  })

  test('translates show hide button', () => {
    const accordion = new Accordion(accordionHTML, i18n)
    accordion.init()

    const showHideButton = document.querySelector('.govuk-accordion__show-all')

    if (showHideButton.getAttribute('aria-expanded')) {
      showHideButton.click()
    }

    const showHideText = showHideButton.querySelector('.govuk-accordion__show-all-text')

    expect(showHideText.innerHTML).toBe('Embiggen all sections')
  })
})

describe('without translations', () => {
  test('uses default text for show hide button', () => {
    console.log('without translations test')
    const accordion = new Accordion(accordionHTML, {})
    accordion.init()

    const showHideButton = document.querySelector('.govuk-accordion__show-all')

    if (showHideButton.getAttribute('aria-expanded')) {
      showHideButton.click()
    }

    const showHideText = showHideButton.querySelector('.govuk-accordion__show-all-text')

    expect(showHideText.innerHTML).toBe('Show all sections')
  })
})
