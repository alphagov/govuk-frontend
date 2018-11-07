/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

const examples = getExamples('input')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Input', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('input', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('input', {
        classes: 'app-input--custom-modifier'
      })

      const $component = $('.govuk-input')
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('input', {
        id: 'my-input'
      })

      const $component = $('.govuk-input')
      expect($component.attr('id')).toEqual('my-input')
    })

    it('renders with name', () => {
      const $ = render('input', {
        name: 'my-input-name'
      })

      const $component = $('.govuk-input')
      expect($component.attr('name')).toEqual('my-input-name')
    })

    it('renders with type="text" by default', () => {
      const $ = render('input', {})

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('text')
    })

    it('allows you to override the type', () => {
      const $ = render('input', {
        type: 'number'
      })

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('number')
    })

    it('renders with value', () => {
      const $ = render('input', {
        value: 'QQ 12 34 56 C'
      })

      const $component = $('.govuk-input')
      expect($component.val()).toEqual('QQ 12 34 56 C')
    })

    it('renders with attributes', () => {
      const $ = render('input', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-input')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('input', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('input', {
        formGroup: {
          classes: 'extra-class'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('input', {
        id: 'input-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('input', {
        id: 'input-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      const $input = $('.govuk-input')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      const $input = $('.govuk-input')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('includes the error class on the input', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-input')
      expect($component.hasClass('govuk-input--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        },
        hint: {
          text: 'Hint'
        }
      })

      const $component = $('.govuk-input')
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
      const $ = render('input', {
        id: 'my-input',
        label: {
          'text': 'National Insurance number'
        }
      })

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          'text': 'National Insurance number'
        }
      })

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          'text': 'National Insurance number'
        }
      })

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('my-input')
    })
  })
})
