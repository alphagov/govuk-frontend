/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('inset-text')

describe('Inset text', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('inset-text', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('inset-text', examples.classes)

      const $component = $('.govuk-inset-text')
      expect($component.hasClass('app-inset-text--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('inset-text', examples.id)

      const $component = $('.govuk-inset-text')
      expect($component.attr('id')).toEqual('my-inset-text')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('inset-text', examples['html as text'])

      const content = $('.govuk-inset-text').html().trim()
      expect(content).toEqual('It can take &lt;b&gt;up to 8 weeks&lt;/b&gt; to register a lasting power of attorney if there are no mistakes in the application.')
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = render('inset-text', examples['with html'])

      const mainContent = $('.govuk-inset-text .govuk-body:first-child').text().trim()
      const warningContent = $('.govuk-inset-text .govuk-warning-text__text').text().trim()
      expect(mainContent).toEqual('It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.')
      expect(warningContent).toEqual('Warning\n    You can be fined up to £5,000 if you don’t register.')
    })

    it('renders with attributes', () => {
      const $ = render('inset-text', examples.attributes)

      const $component = $('.govuk-inset-text')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })
})
