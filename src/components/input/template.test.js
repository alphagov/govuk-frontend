/* eslint-env jest */

const { render, htmlWithClassName } = require('../../../lib/jest-helpers')

describe('Input', () => {
  describe('by default', () => {
    it('renders with classes', () => {
      const $ = render('input', {
        classes: 'app-c-input--custom-modifier'
      })

      const $component = $('.govuk-c-input')
      expect($component.hasClass('app-c-input--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('input', {
        id: 'my-input'
      })

      const $component = $('.govuk-c-input')
      expect($component.attr('id')).toEqual('my-input')
    })

    it('renders with name', () => {
      const $ = render('input', {
        name: 'my-input-name'
      })

      const $component = $('.govuk-c-input')
      expect($component.attr('name')).toEqual('my-input-name')
    })

    it('renders with type="text"', () => {
      const $ = render('input')

      const $component = $('.govuk-c-input')
      expect($component.attr('type')).toEqual('text')
    })

    it('renders with value', () => {
      const $ = render('input', {
        value: 'QQ 12 34 56 C'
      })

      const $component = $('.govuk-c-input')
      expect($component.val()).toEqual('QQ 12 34 56 C')
    })

    it('renders with attributes', () => {
      const $ = render('input', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-c-input')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with dependant components', () => {
    it('renders with label', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          'text': 'National Insurance number'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          'text': 'National Insurance number'
        }
      })

      const $label = $('.govuk-c-label')
      expect($label.attr('for')).toEqual('my-input')
    })

    it('renders with error message', () => {
      const $ = render('input', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    })

    it('has error class when rendered with error message', () => {
      const $ = render('input', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-c-input')
      expect($component.hasClass('govuk-c-input--error')).toBeTruthy()
    })
  })
})
