/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('file-upload')

describe('File upload', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('file-upload', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('file-upload', {
        classes: 'app-c-file-upload--custom-modifier'
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.hasClass('app-c-file-upload--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload'
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.attr('id')).toEqual('my-file-upload')
    })

    it('renders with name', () => {
      const $ = render('file-upload', {
        name: 'my-file-upload-name'
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.attr('name')).toEqual('my-file-upload-name')
    })

    it('renders with value', () => {
      const $ = render('file-upload', {
        value: 'C:/fakepath'
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.val()).toEqual('C:/fakepath')
    })

    it('renders with attributes', () => {
      const $ = render('file-upload', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('file-upload', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-o-form-group > .govuk-c-file-upload')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload',
        label: {
          'text': 'Full address'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the file-upload "id"', () => {
      const $ = render('file-upload', {
        id: 'my-file-upload',
        label: {
          'text': 'Full address'
        }
      })

      const $label = $('.govuk-c-label')
      expect($label.attr('for')).toEqual('my-file-upload')
    })

    it('renders with error message', () => {
      const $ = render('file-upload', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    })

    it('has error class when rendered with error message', () => {
      const $ = render('file-upload', {
        errorMessage: {
          'text': 'Error message'
        }
      })

      const $component = $('.govuk-c-file-upload')
      expect($component.hasClass('govuk-c-file-upload--error')).toBeTruthy()
    })
  })
})
