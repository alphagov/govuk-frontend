/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import ErrorSummary from './error-summary'

let errorSummaryHTML = false

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {}
})

beforeEach(() => {
  errorSummaryHTML = document.createElement('div')
  errorSummaryHTML.setAttribute('class', 'govuk-error-summary')
  errorSummaryHTML.setAttribute('data-module', 'govuk-error-summary')
  document.body.appendChild(errorSummaryHTML)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('init', () => {
  test('does nothing if no module passed', () => {
    const errorSummary = new ErrorSummary()

    expect(errorSummary.init()).toBe(undefined)
  })
})

describe('setFocus', () => {
  test('does nothing if data-disable-auto-focus is set to true', () => {
    errorSummaryHTML.setAttribute('data-disable-auto-focus', 'true')
    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.setFocus()).toBe(undefined)
  })

  test('sets tabindex to -1', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    errorSummary.setFocus()

    expect(errorSummaryHTML.getAttribute('tabindex')).toBe('-1')
  })

  test('removes tabindex on blur', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    errorSummary.setFocus()

    expect(errorSummaryHTML.getAttribute('tabindex')).toBe('-1')

    var blurEvent = document.createEvent('HTMLEvents')
    blurEvent.initEvent('blur', false, true)
    errorSummaryHTML.dispatchEvent(blurEvent)

    expect(errorSummaryHTML.getAttribute('tabindex')).toBe(null)
  })

  test('sets focus to the error summary', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    errorSummary.setFocus()

    expect(document.activeElement).toBe(errorSummaryHTML)
  })
})

describe('focusTarget', () => {
  test('returns false if clicked element is not a link', () => {
    const notLink = document.createElement('span')

    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.focusTarget(notLink)).toBe(false)
  })

  test('returns false if clicked element has no href', () => {
    const linkMissingHref = document.createElement('a')

    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.focusTarget(linkMissingHref)).toBe(false)
  })

  test('returns false if no linked element', () => {
    const linkMissingElement = document.createElement('a')
    linkMissingElement.href = '#missing-element'

    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.focusTarget(linkMissingElement)).toBe(false)
  })

  test('returns false if the linked element has no label or legend', () => {
    const linkNoLabelLegend = document.createElement('a')
    linkNoLabelLegend.href = '#no-label'

    const inputNoLabelLegend = document.createElement('input')
    inputNoLabelLegend.id = 'no-label'
    document.body.appendChild(inputNoLabelLegend)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    expect(errorSummary.focusTarget(linkNoLabelLegend)).toBe(false)
  })

  test('scrolls and focuses if the linked element has a label', () => {
    const linkInputLabel = document.createElement('a')
    linkInputLabel.href = '#input-with-label'

    const inputWithLabel = document.createElement('input')
    inputWithLabel.id = 'input-with-label'
    document.body.appendChild(inputWithLabel)

    const label = document.createElement('label')
    label.setAttribute('for', 'input-with-label')
    document.body.appendChild(label)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    const scrollSpy = jest.spyOn(window.HTMLElement.prototype, 'scrollIntoView')

    errorSummary.focusTarget(linkInputLabel)
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(inputWithLabel)
  })

  test('returns true if the linked element has a label', () => {
    const linkInputLabel = document.createElement('a')
    linkInputLabel.href = '#input-with-label'

    const inputWithLabel = document.createElement('input')
    inputWithLabel.id = 'input-with-label'
    document.body.appendChild(inputWithLabel)

    const label = document.createElement('label')
    label.setAttribute('for', 'input-with-label')
    document.body.appendChild(label)

    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.focusTarget(linkInputLabel)).toBe(true)
  })

  test('scrolls and focuses if the linked element has a label', () => {
    const linkInputLegend = document.createElement('a')
    linkInputLegend.href = '#input-with-legend'

    const inputWithLegend = document.createElement('input')
    inputWithLegend.setAttribute('type', 'radio')
    inputWithLegend.id = 'input-with-legend'

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    document.body.appendChild(fieldset)
    fieldset.appendChild(legend)
    fieldset.appendChild(inputWithLegend)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    const scrollSpy = jest.spyOn(window.HTMLElement.prototype, 'scrollIntoView')

    errorSummary.focusTarget(linkInputLegend)
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(inputWithLegend)
  })

  test('returns true if the linked element has a legend', () => {
    const linkInputLegend = document.createElement('a')
    linkInputLegend.href = '#input-with-legend'

    const inputWithLegend = document.createElement('input')
    inputWithLegend.setAttribute('type', 'radio')
    inputWithLegend.id = 'input-with-legend'

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    document.body.appendChild(fieldset)
    fieldset.appendChild(legend)
    fieldset.appendChild(inputWithLegend)

    const errorSummary = new ErrorSummary(errorSummaryHTML)

    expect(errorSummary.focusTarget(linkInputLegend)).toBe(true)
  })
})

describe('getFragmentFromUrl', () => {
  test('returns false if not an anchor link', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    const fullURL = 'www.google.com'

    expect(errorSummary.getFragmentFromUrl(fullURL)).toBe(false)
  })

  test('returns URL without the #', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    const link = '#anchor'

    expect(errorSummary.getFragmentFromUrl(link)).toBe('anchor')
  })

  test('returns URL (with dashes) without the #', () => {
    const errorSummary = new ErrorSummary(errorSummaryHTML)
    const link = '#anchor-link'

    expect(errorSummary.getFragmentFromUrl(link)).toBe('anchor-link')
  })
})

describe('getAssociatedLegendOrLabel', () => {
  test('returns associated label, if there is one', () => {
    const input = document.createElement('input')
    input.setAttribute('id', 'my-input-1')
    const label = document.createElement('label')
    label.setAttribute('for', 'my-input-1')
    document.body.appendChild(input)
    document.body.appendChild(label)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    expect(errorSummary.getAssociatedLegendOrLabel(input)).toBe(label)
  })

  test('returns label if fieldset has no legend', () => {
    const input = document.createElement('input')
    input.setAttribute('id', 'my-input-1')

    const fieldset = document.createElement('fieldset')

    const label = document.createElement('label')
    label.setAttribute('for', 'my-input-1')

    fieldset.appendChild(label)
    fieldset.appendChild(input)
    document.body.appendChild(fieldset)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    expect(errorSummary.getAssociatedLegendOrLabel(input)).toEqual(label)
  })

  test('returns legend if input type radio', () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'radio')

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')

    fieldset.appendChild(legend)
    fieldset.appendChild(input)
    document.body.appendChild(fieldset)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    expect(errorSummary.getAssociatedLegendOrLabel(input)).toBe(legend)
  })

  test('returns legend if input type checkbox', () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')

    fieldset.appendChild(legend)
    fieldset.appendChild(input)
    document.body.appendChild(fieldset)

    const errorSummary = new ErrorSummary(errorSummaryHTML)
    expect(errorSummary.getAssociatedLegendOrLabel(input)).toBe(legend)
  })
})
