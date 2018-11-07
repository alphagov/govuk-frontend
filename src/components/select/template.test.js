/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

const examples = getExamples('select')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Select', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('select', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('select', {
        classes: 'app-select--custom-modifier'
      })

      const $component = $('.govuk-select')
      expect($component.hasClass('app-select--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('select', {
        id: 'my-select'
      })

      const $component = $('.govuk-select')
      expect($component.attr('id')).toEqual('my-select')
    })

    it('renders with name', () => {
      const $ = render('select', {
        name: 'my-select-name'
      })

      const $component = $('.govuk-select')
      expect($component.attr('name')).toEqual('my-select-name')
    })

    it('renders with items', () => {
      const $ = render('select', {
        items: [
          {
            text: 'Option 1'
          },
          {
            text: 'Options 2'
          }
        ]
      })
      const $items = $('.govuk-select option')
      expect($items.length).toEqual(2)
    })

    it('renders item with value', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            'value': '1',
            text: 'Option 1'
          },
          {
            'value': '2',
            text: 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.attr('value')).toEqual('1')
    })

    it('renders item with text', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            text: 'Option 1'
          },
          {
            text: 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.text()).toEqual('Option 1')
    })

    it('renders item with selected', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            text: 'Option 1',
            'selected': true
          },
          {
            text: 'Options 2'
          }
        ]
      })

      const $firstItem = $('.govuk-select option:first-child')
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

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.attr('disabled')).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('select', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-select')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('select', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('select', {
        formGroup: {
          classes: 'extra-class'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when they include option attributes', () => {
    it('renders the option attributes', () => {
      const $ = render('select', {
        value: '2',
        items: [
          {
            text: 'Option 1',
            attributes: {
              'data-attribute': 'ABC',
              'data-second-attribute': 'DEF'
            }
          },
          {
            text: 'Options 2',
            attributes: {
              'data-attribute': 'GHI',
              'data-second-attribute': 'JKL'
            }
          }
        ]
      })

      const $component = $('.govuk-select')

      const $firstInput = $component.find('option:first-child')
      expect($firstInput.attr('data-attribute')).toEqual('ABC')
      expect($firstInput.attr('data-second-attribute')).toEqual('DEF')

      const $secondInput = $component.find('option:last-child')
      expect($secondInput.attr('data-attribute')).toEqual('GHI')
      expect($secondInput.attr('data-second-attribute')).toEqual('JKL')
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('select', {
        id: 'select-with-hint',
        hint: {
          'text': 'Hint text goes here'
        }
      })

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the select as "described by" the hint', () => {
      const $ = render('select', {
        id: 'select-with-hint',
        hint: {
          'text': 'Hint text goes here'
        }
      })

      const $select = $('.govuk-select')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($select.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('select', {
        id: 'select-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the select as "described by" the error message', () => {
      const $ = render('select', {
        id: 'select-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      const $input = $('.govuk-select')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('adds the error class to the select', () => {
      const $ = render('select', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-select')
      expect($component.hasClass('govuk-select--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('select', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the select as described by both the hint and the error message', () => {
      const $ = render('select', {
        errorMessage: {
          text: 'Error message'
        },
        hint: {
          text: 'Hint'
        }
      })

      const $component = $('.govuk-select')
      const $errorMessageId = $('.govuk-error-message').attr('id')
      const $hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + $hintId + WHITESPACE + $errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('select', {
        id: 'nesting-order',
        label: {
          text: 'National Insurance number'
        },
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-form-group > .govuk-select')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('select', {
        id: 'my-select',
        label: {
          text: 'National Insurance number'
        }
      })

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the select "id"', () => {
      const $ = render('select', {
        id: 'my-select',
        label: {
          text: 'Label text'
        }
      })

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('my-select')
    })
  })
})
