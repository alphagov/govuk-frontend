/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('select')

describe('Select', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('select', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('select', {
        classes: 'app-c-select--custom-modifier'
      })

      const $component = $('.govuk-c-select')
      expect($component.hasClass('app-c-select--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('select', {
        id: 'my-select'
      })

      const $component = $('.govuk-c-select')
      expect($component.attr('id')).toEqual('my-select')
    })

    it('renders with name', () => {
      const $ = render('select', {
        name: 'my-select-name'
      })

      const $component = $('.govuk-c-select')
      expect($component.attr('name')).toEqual('my-select-name')
    })

    it('renders with items', () => {
      const $ = render('select', {
        items: [
          {
            'text': 'Option 1'
          },
          {
            'text': 'Options 2'
          }
        ]
      })
      const $items = $('.govuk-c-select option')
      expect($items.length).toEqual(2)
    })

    it('renders item with value', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            'value': '1',
            'text': 'Option 1'
          },
          {
            'value': '2',
            'text': 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-c-select option:first-child')
      expect($firstItem.attr('value')).toEqual('1')
    })

    it('renders item with text', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            'text': 'Option 1'
          },
          {
            'text': 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-c-select option:first-child')
      expect($firstItem.text()).toEqual('Option 1')
    })

    it('renders item with selected', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            'text': 'Option 1',
            'selected': true
          },
          {
            'text': 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-c-select option:first-child')
      expect($firstItem.attr('selected')).toBeTruthy()
    })

    it('renders item with disabled', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            text: 'Option 1',
            disabled: true
          },
          {
            text: 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-c-select option:first-child')
      expect($firstItem.attr('disabled')).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('select', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-c-select')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('select', {
        id: 'nesting-order',
        label: {
          'text': 'National Insurance number'
        },
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-o-form-group > .govuk-c-select')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('select', {
        id: 'my-select',
        label: {
          'text': 'National Insurance number'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the select "id"', () => {
      const $ = render('select', {
        id: 'my-select',
        label: {
          'text': 'Label text'
        }
      })

      const $label = $('.govuk-c-label')
      expect($label.attr('for')).toEqual('my-select')
    })

    it('renders with error message', () => {
      const $ = render('select', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    })

    it('has error class when rendered with error message', () => {
      const $ = render('select', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-c-select')
      expect($component.hasClass('govuk-c-select--error')).toBeTruthy()
    })
  })
})
