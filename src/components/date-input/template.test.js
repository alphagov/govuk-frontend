/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

    it('renders with default items', () => {
      const $ = render('date-input', {})

      const $items = $('.govuk-date-input__item')
      const $firstItemInput = $('.govuk-date-input:first-child .govuk-date-input__input')

      expect($items.length).toEqual(3)
      expect($firstItemInput.attr('name')).toEqual('day')
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

    it('renders items with name', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'date[dd]'
          },
          {
            'name': 'date[mm]'
          },
          {
            'name': 'date[yyy]'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('name')).toEqual('date[dd]')
    })

    it('renders item with suffixed name for input', () => {
      const $ = render('date-input', {
        namePrefix: 'my-date-input',
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

    it('renders items with id', () => {
      const $ = render('date-input', {
        items: [
          {
            'id': 'day'
          },
          {
            'id': 'month'
          },
          {
            'id': 'year'
          }
        ]
      })

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('id')).toEqual('day')
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

    it('renders items with value', () => {
      const $ = render('date-input', {
        items: [
          {
            id: 'day'
          },
          {
            id: 'month'
          },
          {
            id: 'year',
            value: '2018'
          }
        ]
      })

      const $lastItems = $('.govuk-date-input__item:last-child input')
      expect($lastItems.val()).toEqual('2018')
    })

    it('sets the `group` role on the fieldset to force JAWS18 to announce the hint and error message', () => {
      const $ = render('date-input', examples['with errors'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('role')).toEqual('group')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('date-input', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('date-input', examples['with errors'])
      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('date-input', examples['with errors'])

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
      const $ = render('date-input', examples['with errors'])
      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('uses the id as a prefix for the error message id', () => {
      const $ = render('date-input', examples['with errors'])

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('dob-errors-error')
    })

    it('associates the fieldset as "described by" the error message', () => {
      const $ = render('date-input', examples['with errors'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('date-input', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('date-input', examples['with errors'])

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
          html: 'What is your <b>date of birth</b>?'
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

  it('can have classes for individual items', () => {
    const $ = render('date-input', {
      items: [
        {
          'name': 'day',
          'classes': 'app-date-input__day'
        },
        {
          'name': 'month',
          'classes': 'app-date-input__month'
        },
        {
          'name': 'year',
          'classes': 'app-date-input__year'
        }
      ]
    })

    const $dayInput = $('[name="day"]')
    const $monthInput = $('[name="month"]')
    const $yearInput = $('[name="year"]')
    expect($dayInput.hasClass('app-date-input__day')).toBeTruthy()
    expect($monthInput.hasClass('app-date-input__month')).toBeTruthy()
    expect($yearInput.hasClass('app-date-input__year')).toBeTruthy()
  })

  it('does not set classes as undefined if none are defined', () => {
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

    const $dayInput = $('[name="day"]')
    const $monthInput = $('[name="month"]')
    const $yearInput = $('[name="year"]')
    expect($dayInput.hasClass('undefined')).toBeFalsy()
    expect($monthInput.hasClass('undefined')).toBeFalsy()
    expect($yearInput.hasClass('undefined')).toBeFalsy()
  })
})
