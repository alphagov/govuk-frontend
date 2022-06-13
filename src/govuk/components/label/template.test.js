/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

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

    it('does not output anything if no html or text is provided', () => {
      const $ = render('label', examples.empty)

      const $component = $('.govuk-label')

      expect($component.length).toEqual(0)
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('label', examples.classes)

      const $component = $('.govuk-label')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('renders label text', () => {
      const $ = render('label', examples.default)
      const labelText = $('.govuk-label').text().trim()

      expect(labelText).toEqual('National Insurance number')
    })

    it('allows label text to be passed whilst escaping HTML entities', () => {
      const $ = render('label', examples['html as text'])

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number, &lt;em&gt;NINO&lt;/em&gt;')
    })

    it('allows label HTML to be passed un-escaped', () => {
      const $ = render('label', examples.html)

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number <em>NINO</em>')
    })

    it('renders for attribute if specified', () => {
      const $ = render('label', examples.for)

      const labelForAttr = $('.govuk-label').attr('for')
      expect(labelForAttr).toEqual('#dummy-input')
    })

    it('can be nested inside an H1 using isPageHeading', () => {
      const $ = render('label', examples['as page heading l'])

      const $selector = $('h1 > .govuk-label')
      expect($selector.length).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('label', examples.attributes)

      const $component = $('.govuk-label')
      expect($component.attr('first-attribute')).toEqual('foo')
      expect($component.attr('second-attribute')).toEqual('bar')
    })
  })
})
