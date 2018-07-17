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

    it('sets the `group` role on the fieldset to force JAWS18 to announce the hint and error message', () => {
      const $ = render('date-input', examples['with errors'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('role')).toEqual('group')
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

  // https://github.com/alphagov/govuk-frontend/issues/905
  describe('to maintain backwards compatibility', () => {
    it('automatically sets width for the day input if no width class provided', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day',
            'classes': 'not-a-width-class'
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
      expect($dayInput.hasClass('govuk-input--width-2')).toBeTruthy()
    })

    it('automatically sets width for the month input if no width class provided', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month',
            'classes': 'not-a-width-class'
          },
          {
            'name': 'year'
          }
        ]
      })

      const $monthInput = $('[name="month"]')
      expect($monthInput.hasClass('govuk-input--width-2')).toBeTruthy()
    })

    it('automatically sets width for the year input if no width class provided', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year',
            'classes': 'not-a-width-class'
          }
        ]
      })

      const $yearInput = $('[name="year"]')
      expect($yearInput.hasClass('govuk-input--width-4')).toBeTruthy()
    })

    it('automatically sets width for an input if no classes provided', () => {
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
      expect($dayInput.hasClass('govuk-input--width-2')).toBeTruthy()
    })

    it('does not add classes if a width class is provided', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'day'
          },
          {
            'name': 'month'
          },
          {
            'name': 'year',
            'classes': 'govuk-input--width-10'
          }
        ]
      })

      const $yearInput = $('[name="year"]')
      expect($yearInput.hasClass('govuk-input--width-4')).not.toBeTruthy()
    })

    it('does not add classes for fields with different names', () => {
      const $ = render('date-input', {
        items: [
          {
            'name': 'foo',
            'classes': 'a-class'
          }
        ]
      })

      const $fooInput = $('[name="foo"]')
      expect($fooInput.attr('class')).not.toEqual(
        expect.stringContaining('govuk-input--width-')
      )
    })
  })
})
