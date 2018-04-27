/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('textarea')

describe('Textarea', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('textarea', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('textarea', {
        classes: 'app-c-textarea--custom-modifier'
      })

      const $component = $('.govuk-c-textarea')
      expect($component.hasClass('app-c-textarea--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('textarea', {
        id: 'my-textarea'
      })

      const $component = $('.govuk-c-textarea')
      expect($component.attr('id')).toEqual('my-textarea')
    })

    it('renders with name', () => {
      const $ = render('textarea', {
        name: 'my-textarea-name'
      })

      const $component = $('.govuk-c-textarea')
      expect($component.attr('name')).toEqual('my-textarea-name')
    })

    it('renders with rows', () => {
      const $ = render('textarea', {
        rows: '4'
      })

      const $component = $('.govuk-c-textarea')
      expect($component.attr('rows')).toEqual('4')
    })

    it('renders with default number of rows', () => {
      const $ = render('textarea', {})

      const $component = $('.govuk-c-textarea')
      expect($component.attr('rows')).toEqual('5')
    })

    it('renders with value', () => {
      const $ = render('textarea', {
        value: '221B Baker Street\nLondon\nNW1 6XE\n'
      })

      const $component = $('.govuk-c-textarea')
      expect($component.text()).toEqual('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      const $ = render('textarea', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-c-textarea')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('textarea', {
        id: 'nested-order',
        label: {
          'text': 'Full address'
        },
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-o-form-group > .govuk-c-textarea')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('textarea', {
        id: 'my-textarea',
        label: {
          'text': 'Full address'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the textarea "id"', () => {
      const $ = render('textarea', {
        id: 'my-textarea',
        label: {
          'text': 'Full address'
        }
      })

      const $label = $('.govuk-c-label')
      expect($label.attr('for')).toEqual('my-textarea')
    })

    it('renders with error message', () => {
      const $ = render('textarea', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    })

    it('has error class when rendered with error message', () => {
      const $ = render('textarea', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-c-textarea')
      expect($component.hasClass('govuk-c-textarea--error')).toBeTruthy()
    })
  })
})
