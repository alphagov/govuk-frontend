/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

const examples = getExamples('date-input')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Date input', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('date-input', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  describe('by default', () => {
    it('renders with classes', () => {
      const $ = render('date-input', {
        classes: 'app-date-input--custom-modifier'
      })

      const $component = $('.govuk-date-input')
      expect($component.hasClass('app-date-input--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('date-input', {
        id: 'my-date-input'
      })

      const $component = $('.govuk-date-input')
      expect($component.attr('id')).toEqual('my-date-input')
    })

    it('renders with attributes', () => {
      const $ = render('date-input', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-date-input')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with items', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $items = $('.govuk-date-input__item')
      expect($items.length).toEqual(3)
    })

    it('renders item with capitalised label text', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child')
      expect($firstItems.text().trim()).toEqual('Day')
    })

    it('renders inputs with type="number"', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          }
        ]
      })

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('type')).toEqual('number')
    })

    it('renders inputs with pattern="[0-9]*" to trigger numeric keypad on iOS', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          }
        ]
      })

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('pattern')).toEqual('[0-9]*')
    })

    it('renders item with implicit class for label', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child label')
      expect($firstItems.hasClass('govuk-date-input__label')).toBeTruthy()
    })

    it('renders item with implicit class for input', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.hasClass('govuk-date-input__input')).toBeTruthy()
    })

    it('renders item with suffixed name for input', () => {
      const $ = render('date-input', {
        name: 'my-date-input',
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('name')).toEqual('my-date-input-day')
    })

    it('renders item with suffixed id for input', () => {
      const $ = render('date-input', {
        id: 'my-date-input',
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('id')).toEqual('my-date-input-day')
    })

    it('sets the `group` role on the fieldset to force JAWS18 to announce the hint and error message', () => {
      const $ = render('date-input', examples['with-errors'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('role')).toEqual('group')
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('date-input', examples['with-errors'])
      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('date-input', examples['with-errors'])

      const $fieldset = $('.govuk-fieldset')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('date-input', examples['with-errors'])
      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('uses the id as a prefix for the error message id', () => {
      const $ = render('date-input', examples['with-errors'])

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('dob-errors-error')
    })

    it('associates the fieldset as "described by" the error message', () => {
      const $ = render('date-input', examples['with-errors'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('date-input', examples['with-errors'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessageId = $('.govuk-error-message').attr('id')
      const $hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + $hintId + WHITESPACE + $errorMessageId + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(combinedIds)
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('date-input', examples['default'])

      const $component = $('.govuk-form-group > .govuk-fieldset > .govuk-date-input')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('date-input', examples['default'])

      expect(htmlWithClassName($, '.govuk-date-input__label')).toMatchSnapshot()
    })
  })

  it('passes through fieldset params without breaking', () => {
    const $ = render('date-input', examples['default'])

    expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
  })

  it('passes through html fieldset params without breaking', () => {
    const $ = render('date-input', {
      id: 'dob',
      name: 'dob',
      fieldset: {
        legend: {
          text: 'What is your <b>date of birth</b>?',
          safe: true
        }
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day'
        },
        {
          name: 'month'
        },
        {
          name: 'year'
        }
      ]
    })

    expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
  })

  describe('with keyword arguments', () => {
    it('allows date-input params to be passed as keyword arguments', () => {
      const $ = renderMacro('date-input', null, {
        id: 'id',
        name: 'name',
        fieldset: {
          legend: {
            text: 'legend text'
          }
        },
        hint: {
          text: 'hint text'
        },
        items: [
          {
            name: 'day'
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

      const $component = $('.govuk-date-input')
      expect($component.attr('id')).toEqual('id')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      // expect($component.attr('class')).toContain('govuk-date-input--error')

      const $input = $('input')
      expect($input.length).toEqual(1)
      expect($input.attr('name')).toEqual('name-day')

      const $legend = $('.govuk-fieldset__legend')
      expect($legend.html()).toContain('legend text')

      const $hint = $('.govuk-hint')
      expect($hint.html()).toContain('hint text')

      const $error = $('.govuk-error-message')
      expect($error.html()).toContain('error text')

      const $group = $('.govuk-form-group')
      expect($group.attr('class')).toContain('govuk-form-group--error')
    })

    it('uses fieldset keyword argument before params.fieldset', () => {
      const $ = renderMacro('date-input', {
        fieldset: {
          legend: {
            text: 'params text'
          }
        }
      }, {
        fieldset: {
          legend: {
            text: 'keyword text'
          }
        }
      })

      const $legend = $('.govuk-fieldset__legend')
      expect($legend.html()).toContain('keyword text')
    })

    it('uses hint keyword argument before params.hint', () => {
      const $ = renderMacro('date-input', {
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
      const $ = renderMacro('date-input', {
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
      const $ = renderMacro('date-input', {
        id: 'paramsId'
      }, {
        id: 'keywordId'
      })

      const $component = $('.govuk-date-input')
      expect($component.attr('id')).toEqual('keywordId')
    })

    it('uses name keyword argument before params.name', () => {
      const $ = renderMacro('date-input', {
        items: [
          {
            name: 'day'
          }
        ],
        name: 'paramsName'
      }, {
        name: 'keywordName'
      })

      const $component = $('input')
      expect($component.attr('name')).toContain('keywordName-day')
    })

    it('uses items keyword argument before params.items', () => {
      const $ = renderMacro('date-input', {
        items: [
          {
            name: 'month'
          }
        ]
      }, {
        items: [
          {
            name: 'year'
          }
        ]
      })

      const $input = $('input')
      expect($input.attr('name')).toContain('year')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('date-input', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-date-input')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('date-input', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-date-input')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.items[]html', () => {
      const $ = renderMacro('date-input', {
        items: [{
          html: '<b>params text</b>'
        }]
      })

      expect($.html()).toContain('<strong class="deprecated">params.items[]html is deprecated in govukDateInput</strong>')
    })
  })
})
