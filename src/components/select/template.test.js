/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

  describe('with keyword arguments', () => {
    it('allows select params to be passed as keyword arguments', () => {
      const $ = renderMacro('select', null, {
        id: 'id',
        name: 'name',
        label: {
          text: 'label text'
        },
        hint: {
          text: 'hint text'
        },
        items: [
          {
            text: 'option text'
          }
        ],
        errorMessage: {
          text: 'error text'
        },
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-select')
      expect($component.attr('id')).toEqual('id')
      expect($component.attr('name')).toEqual('name')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      expect($component.attr('class')).toContain('govuk-select--error')

      const $option = $('option')
      expect($option.length).toEqual(1)
      expect($option.text().trim()).toEqual('option text')

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
      const $ = renderMacro('select', {
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
      const $ = renderMacro('select', {
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
      const $ = renderMacro('select', {
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
      const $ = renderMacro('select', {
        id: 'paramsId'
      }, {
        id: 'keywordId'
      })

      const $component = $('.govuk-select')
      expect($component.attr('id')).toContain('keywordId')
    })

    it('uses name keyword argument before params.name', () => {
      const $ = renderMacro('select', {
        name: 'paramsName'
      }, {
        name: 'keywordName'
      })

      const $component = $('.govuk-select')
      expect($component.attr('name')).toContain('keywordName')
    })

    it('uses items keyword argument before params.items', () => {
      const $ = renderMacro('select', {
        items: [
          {
            text: 'params text'
          }
        ]
      }, {
        items: [
          {
            text: 'keyword text'
          }
        ]
      })

      const $component = $('option')
      expect($component.text().trim()).toEqual('keyword text')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('select', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-select')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('select', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-select')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.items[]html', () => {
      const $ = renderMacro('select', {
        items: [{
          html: '<b>params text</b>'
        }]
      })

      expect($.html()).toContain('<strong class="deprecated">params.items[]html is deprecated in govukSelect</strong>')
    })
  })
})
