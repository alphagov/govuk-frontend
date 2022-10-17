/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const { axe, render, getExamples } = require('../../../../lib/jest-helpers')

describe('Hide this page', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('hide-this-page')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('hide-this-page', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the default example', () => {
      const $ = render('hide-this-page', examples.default)
      const $button = $('.govuk-hide-this-page').find('.govuk-button')

      expect($button.hasClass('govuk-button--warning')).toBeTruthy()
      expect($button.text()).toContain('Hide this page')
      expect($button.attr('href')).toBe('https://www.gov.uk')
    })
  })

  describe('Custom options', () => {
    it('renders with text', () => {
      const $ = render('hide-this-page', examples.testing)
      const $button = $('.govuk-hide-this-page').find('.govuk-button')

      expect($button.text()).toContain('Hide this test')
    })

    it('renders with a current tab URL', () => {
      const $ = render('hide-this-page', examples.testing)
      const $button = $('.govuk-hide-this-page').find('.govuk-button')

      expect($button.attr('href')).toBe('https://www.test.co.uk')
    })

    it('renders with a custom id', () => {
      const $ = render('hide-this-page', examples.testing)
      const $component = $('.govuk-hide-this-page')

      expect($component.attr('id')).toBe('test-id')
    })

    it('renders with a custom class', () => {
      const $ = render('hide-this-page', examples.testing)
      const $component = $('.govuk-hide-this-page')

      expect($component.hasClass('test-class')).toBeTruthy()
    })

    it('renders with custom attributes', () => {
      const $ = render('hide-this-page', examples.testing)
      const $component = $('.govuk-hide-this-page')

      expect($component.attr('test-attribute')).toBe('true')
    })
  })
})
