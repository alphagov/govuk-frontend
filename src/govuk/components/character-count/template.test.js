/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('textarea')

const WORD_BOUNDARY = '\\b'

describe('Character count', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('character-count', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('character-count', {
        classes: 'app-character-count--custom-modifier'
      })

      const $component = $('.govuk-js-character-count')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('character-count', {
        id: 'my-character-count'
      })

      const $component = $('.govuk-js-character-count')
      expect($component.attr('id')).toEqual('my-character-count')
    })

    it('renders with name', () => {
      const $ = render('character-count', {
        name: 'my-character-count-name'
      })

      const $component = $('.govuk-js-character-count')
      expect($component.attr('name')).toEqual('my-character-count-name')
    })

    it('renders with rows', () => {
      const $ = render('character-count', {
        rows: '4'
      })

      const $component = $('.govuk-js-character-count')
      expect($component.attr('rows')).toEqual('4')
    })

    it('renders with default number of rows', () => {
      const $ = render('character-count', {})

      const $component = $('.govuk-js-character-count')
      expect($component.attr('rows')).toEqual('5')
    })

    it('renders with value', () => {
      const $ = render('character-count', {
        value: '221B Baker Street\nLondon\nNW1 6XE\n'
      })

      const $component = $('.govuk-js-character-count')
      expect($component.text()).toEqual('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      const $ = render('character-count', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-js-character-count')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      const $ = render('character-count', {
        id: 'character-count-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the character count as "described by" the hint', () => {
      const $ = render('character-count', {
        id: 'character-count-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      const $textarea = $('.govuk-js-character-count')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($textarea.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('character-count', {
        id: 'character-count-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the character-count as "described by" the error message', () => {
      const $ = render('character-count', {
        id: 'character-count-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-js-character-count')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('adds the error class to the character-count', () => {
      const $ = render('character-count', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-js-character-count')
      expect($component.hasClass('govuk-textarea--error')).toBeTruthy()
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('character-count', {
        id: 'nested-order',
        label: {
          text: 'Full address'
        },
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-form-group > .govuk-js-character-count')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('character-count', {
        id: 'my-character-count',
        label: {
          text: 'Full address'
        }
      })

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the character count "id"', () => {
      const $ = render('character-count', {
        id: 'my-character-count',
        label: {
          text: 'Full address'
        }
      })

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('my-character-count')
    })
  })
})
