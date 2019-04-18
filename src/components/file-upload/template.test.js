/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

const examples = getExamples('file-upload')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('File upload', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('file-upload', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('file-upload', {
        classes: 'app-file-upload--custom-modifier'
      })

      const $component = $('.govuk-file-upload')
      expect($component.hasClass('app-file-upload--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload'
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('id')).toEqual('my-file-upload')
    })

    it('renders with name', () => {
      const $ = render('file-upload', {
        name: 'my-file-upload-name'
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('name')).toEqual('my-file-upload-name')
    })

    it('renders with value', () => {
      const $ = render('file-upload', {
        value: 'C:/fakepath'
      })

      const $component = $('.govuk-file-upload')
      expect($component.val()).toEqual('C:/fakepath')
    })

    it('renders with attributes', () => {
      const $ = render('file-upload', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('file-upload', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('file-upload', {
        formGroup: {
          classes: 'extra-class'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      const $ = render('file-upload', {
        id: 'file-upload-with-hint',
        errorMessage: {
          text: 'Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.'
        }
      })

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('file-upload', {
        id: 'file-upload-with-hint',
        hint: {
          text: 'Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.'
        }
      })

      const $component = $('.govuk-file-upload')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('file-upload', {
        id: 'file-upload-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('file-upload', {
        id: 'input-with-error',
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-file-upload')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('includes the error class on the component', () => {
      const $ = render('file-upload', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-file-upload')
      expect($component.hasClass('govuk-file-upload--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('file-upload', {
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
      const $ = render('file-upload', {
        id: 'input-with-error',
        errorMessage: {
          'text': 'Error message'
        },
        hint: {
          'text': 'Hint'
        }
      })

      const $component = $('.govuk-file-upload')
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
      const $ = render('file-upload', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-form-group > .govuk-file-upload')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload',
        label: {
          text: 'Full address'
        }
      })

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the file-upload "id"', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload',
        label: {
          text: 'Full address'
        }
      })

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('my-file-upload')
    })
  })
})
