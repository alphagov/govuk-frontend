/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

  describe('with keyword arguments', () => {
    it('allows file-upload params to be passed as keyword arguments', () => {
      const $ = renderMacro('file-upload', null, {
        id: 'id',
        name: 'name',
        label: {
          text: 'label text'
        },
        hint: {
          text: 'hint text'
        },
        value: 'file-upload value',
        errorMessage: {
          text: 'error text'
        },
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('id')).toEqual('id')
      expect($component.attr('name')).toEqual('name')
      expect($component.attr('value')).toEqual('file-upload value')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      expect($component.attr('class')).toContain('govuk-file-upload--error')

      const $label = $('.govuk-label')
      expect($label.html()).toContain('label text')

      const $hint = $('.govuk-hint')
      expect($hint.html()).toContain('hint text')

      const $error = $('.govuk-error-message')
      expect($error.html()).toContain('error text')

      const $group = $('.govuk-form-group')
      expect($group.attr('class')).toContain('govuk-form-group--error')
    })

    it('uses label keyword argument before params.label', () => {
      const $ = renderMacro('file-upload', {
        label: {
          text: 'params text'
        }
      }, {
        label: {
          text: 'keyword text'
        }
      })

      const $label = $('.govuk-label')
      expect($label.html()).toContain('keyword text')
    })

    it('uses hint keyword argument before params.hint', () => {
      const $ = renderMacro('file-upload', {
        hint: {
          text: 'params text'
        }
      }, {
        hint: {
          text: 'keyword text'
        }
      })

      const $hint = $('.govuk-hint')
      expect($hint.html()).toContain('keyword text')
    })

    it('uses error keyword argument before params.error', () => {
      const $ = renderMacro('file-upload', {
        errorMessage: {
          text: 'params text'
        }
      }, {
        errorMessage: {
          text: 'keyword text'
        }
      })

      const $error = $('.govuk-error-message')
      expect($error.html()).toContain('keyword text')
    })

    it('uses id keyword argument before params.id', () => {
      const $ = renderMacro('file-upload', {
        id: 'paramsId'
      }, {
        id: 'keywordId'
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('id')).toContain('keywordId')
    })

    it('uses name keyword argument before params.name', () => {
      const $ = renderMacro('file-upload', {
        name: 'paramsName'
      }, {
        name: 'keywordName'
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('name')).toContain('keywordName')
    })

    it('uses value keyword argument before params.value', () => {
      const $ = renderMacro('file-upload', {
        value: 'params value'
      }, {
        value: 'keyword value'
      })

      const $component = $('.govuk-file-upload')
      expect($component.attr('value')).toEqual('keyword value')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('file-upload', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-file-upload')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('file-upload', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-file-upload')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })
})
