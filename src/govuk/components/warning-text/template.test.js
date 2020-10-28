/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('warning-text')

describe('Warning text', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('warning-text', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with text', () => {
      const $ = render('warning-text', examples.default)

      const $component = $('.govuk-warning-text')
      expect($component.text()).toContain('You can be fined up to £5,000 if you don’t register.')
    })

    it('renders with assistive text', () => {
      const $ = render('warning-text', examples.default)

      const $assistiveText = $('.govuk-warning-text__assistive')
      expect($assistiveText.text()).toEqual('Warning')
    })

    it('hides the icon from screen readers using the aria-hidden attribute', () => {
      const $ = render('warning-text', examples.default)

      const $icon = $('.govuk-warning-text__icon')
      expect($icon.attr('aria-hidden')).toEqual('true')
    })
  })

  describe('custom options', () => {
    it('renders classes', () => {
      const $ = render('warning-text', examples.classes)

      const $component = $('.govuk-warning-text')
      expect($component.hasClass('govuk-warning-text--custom-class')).toBeTruthy()
    })

    it('renders custom assistive text', () => {
      const $ = render('warning-text', examples['icon fallback text only'])

      const $assistiveText = $('.govuk-warning-text__assistive')
      expect($assistiveText.html()).toContain('Some custom fallback text')
    })

    it('renders attributes', () => {
      const $ = render('warning-text', examples.attributes)

      const $component = $('.govuk-warning-text')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('id')).toEqual('my-warning-text')
    })
  })

  describe('html', () => {
    it('renders escaped html when passed to text', () => {
      const $ = render('warning-text', examples['html as text'])

      const $component = $('.govuk-warning-text')
      expect($component.html()).toContain('&lt;span&gt;Some custom warning text&lt;/span&gt;')
    })

    it('renders html', () => {
      const $ = render('warning-text', examples.html)

      const $component = $('.govuk-warning-text')
      expect($component.html()).toContain('<span>Some custom warning text</span>')
    })
  })
})
