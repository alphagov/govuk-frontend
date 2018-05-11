/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('hint')

describe('Hint', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('hint', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('hint', {
        classes: 'app-hint--custom-modifier'
      })

      const $component = $('.govuk-hint')
      expect($component.hasClass('app-hint--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('hint', {
        id: 'my-hint'
      })

      const $component = $('.govuk-hint')
      expect($component.attr('id')).toEqual('my-hint')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('hint', {
        text: 'Unexpected <strong>bold text</strong> in body'
      })

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('Unexpected &lt;strong&gt;bold text&lt;/strong&gt; in body')
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = render('hint', {
        html: 'Unexpected <b>bold text</b> in body copy'
      })

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('Unexpected <b>bold text</b> in body copy')
    })

    it('renders with attributes', () => {
      const $ = render('hint', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-hint')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })
})
