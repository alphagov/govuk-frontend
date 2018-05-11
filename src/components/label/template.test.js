/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('label')

describe('Label', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('label', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a label element', () => {
      const $ = render('label', examples.default)

      const $component = $('.govuk-label')
      expect($component.get(0).tagName).toEqual('label')
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('label', {
        classes: 'extra-class one-more-class'
      })

      const $component = $('.govuk-label')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('renders label text', () => {
      const $ = render('label', {
        text: 'National Insurance number'
      })
      const labelText = $('.govuk-label').text().trim()

      expect(labelText).toEqual('National Insurance number')
    })

    it('allows label text to be passed whilst escaping HTML entities', () => {
      const $ = render('label', {
        text: 'National Insurance number, <em>NINO</em>'
      })

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number, &lt;em&gt;NINO&lt;/em&gt;')
    })

    it('allows label HTML to be passed un-escaped', () => {
      const $ = render('label', {
        html: 'National Insurance number <em>NINO</em>'
      })

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number <em>NINO</em>')
    })

    it('renders for attribute if specified', () => {
      const $ = render('label', {
        for: '#dummy-input'
      })

      const labelForAttr = $('.govuk-label').attr('for')
      expect(labelForAttr).toEqual('#dummy-input')
    })

    it('can be nested inside an H1 using isPageHeading', () => {
      const $ = render('label', {
        text: 'National Insurance number',
        isPageHeading: true
      })

      const $selector = $('h1 > .govuk-label')
      expect($selector.length).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('label', {
        attributes: {
          'first-attribute': 'true',
          'second-attribute': 'false'
        }
      })

      const $component = $('.govuk-label')
      expect($component.attr('first-attribute')).toEqual('true')
      expect($component.attr('second-attribute')).toEqual('false')
    })
  })
})
