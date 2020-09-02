/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('input')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Input', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('input', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with id', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('id')).toEqual('input-example')
    })

    it('renders with name', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('name')).toEqual('test-name')
    })

    it('renders with type="text" by default', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('text')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('input', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('input', examples.classes)

      const $component = $('.govuk-input')
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy()
    })

    it('allows you to override the type', () => {
      const $ = render('input', examples['custom type'])

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('number')
    })

    it('renders with pattern attribute', () => {
      const $ = render('input', examples['with pattern attribute'])

      const $component = $('.govuk-input')
      expect($component.attr('pattern')).toEqual('[0-9]*')
    })

    it('renders with value', () => {
      const $ = render('input', examples.value)

      const $component = $('.govuk-input')
      expect($component.val()).toEqual('QQ 12 34 56 C')
    })

    it('renders with aria-describedby', () => {
      const $ = render('input', examples['with describedBy'])

      const $component = $('.govuk-input')
      expect($component.attr('aria-describedby')).toMatch('some-id')
    })

    it('renders with attributes', () => {
      const $ = render('input', examples.attributes)

      const $component = $('.govuk-input')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('input', examples['with optional form-group classes'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('input', examples['with hint text'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('input', examples['with hint text'])

      const $input = $('.govuk-input')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(hintId)
    })

    it('associates the input as "described by" the hint and parent fieldset', () => {
      const $ = render('input', examples['hint with describedBy'])

      const $input = $('.govuk-input')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + 'some-id' + WHITESPACE + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('input', examples['with error message'])

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('input', examples['with error message'])

      const $input = $('.govuk-input')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('associates the input as "described by" the error message and parent fieldset', () => {
      const $ = render('input', examples['error with describedBy'])

      const $input = $('.govuk-input')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + 'some-id' + WHITESPACE + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('includes the error class on the input', () => {
      const $ = render('input', examples['with error message'])

      const $component = $('.govuk-input')
      expect($component.hasClass('govuk-input--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('input', examples['with error message'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders with spellcheck attribute set to true', () => {
      const $ = render('input', examples['with spellcheck enabled'])

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toEqual('true')
    })

    it('renders with spellcheck attribute set to false', () => {
      const $ = render('input', examples['with spellcheck disabled'])

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toEqual('false')
    })

    it('renders without spellcheck attribute by default', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toBeUndefined()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('input', examples['with error and hint'])

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })

    it('associates the input as described by the hint, error message and parent fieldset', () => {
      const $ = render('input', examples['with error, hint and describedBy'])

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + 'some-id' + WHITESPACE + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('input', examples.default)

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('input', examples.default)

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('input-example')
    })
  })

  describe('when it includes an autocomplete attribute', () => {
    it('renders the autocomplete attribute', () => {
      const $ = render('input', examples['with autocomplete attribute'])

      const $component = $('.govuk-input')
      expect($component.attr('autocomplete')).toEqual('postal-code')
    })
  })

  describe('when it includes an inputmode', () => {
    it('renders with an inputmode attached to the input', () => {
      const $ = render('input', examples.inputmode)

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.attr('inputmode')).toEqual('decimal')
    })
  })
})
