/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const { axe, render, getExamples } = require('../../../../lib/jest-helpers')

describe('Exit this page', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('exit-this-page')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('exit-this-page', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the default example', () => {
      const $ = render('exit-this-page', examples.default)
      const $button = $('.govuk-exit-this-page').find('.govuk-button')

      expect($button.hasClass('govuk-button--warning')).toBeTruthy()
      expect($button.text()).toContain('Exit this page')
      expect($button.attr('href')).toBe('https://www.gov.uk')
    })
  })

  describe('Custom options', () => {
    it('renders with text', () => {
      const $ = render('exit-this-page', examples.testing)
      const $button = $('.govuk-exit-this-page').find('.govuk-button')

      expect($button.text()).toContain('Exit this test')
    })

    it('renders with a current tab URL', () => {
      const $ = render('exit-this-page', examples.testing)
      const $button = $('.govuk-exit-this-page').find('.govuk-button')

      expect($button.attr('href')).toBe('https://www.test.co.uk')
    })

    it('renders with a custom id', () => {
      const $ = render('exit-this-page', examples.testing)
      const $component = $('.govuk-exit-this-page')

      expect($component.attr('id')).toBe('test-id')
    })

    it('renders with a custom class', () => {
      const $ = render('exit-this-page', examples.testing)
      const $component = $('.govuk-exit-this-page')

      expect($component.hasClass('test-class')).toBeTruthy()
    })

    it('renders with custom attributes', () => {
      const $ = render('exit-this-page', examples.testing)
      const $component = $('.govuk-exit-this-page')

      expect($component.attr('test-attribute')).toBe('true')
    })
  })

  describe('Translated', () => {
    it('renders with translation data attributes', () => {
      const $ = render('exit-this-page', examples.translated)
      const $component = $('.govuk-exit-this-page')

      expect($component.attr('data-i18n.activated')).toBe('Tudalen ymadael')
      expect($component.attr('data-i18n.timed-out')).toBe("Wedi'i amseru")
      expect($component.attr('data-i18n.press-two-more-times')).toBe("Pwyswch 'Shift' 2 gwaith arall")
      expect($component.attr('data-i18n.press-one-more-time')).toBe("Pwyswch 'Shift' 1 mwy o amser")
    })
  })
})
