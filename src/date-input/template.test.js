/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('date-input')

describe('Date input', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('date-input', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  describe('by default', () => {
    it('renders with classes', () => {
      const $ = render('date-input', {
        classes: 'app-c-date-input--custom-modifier'
      })

      const $component = $('.govuk-c-date-input')
      expect($component.hasClass('app-c-date-input--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('date-input', {
        id: 'my-date-input'
      })

      const $component = $('.govuk-c-date-input')
      expect($component.attr('id')).toEqual('my-date-input')
    })

    it('renders with attributes', () => {
      const $ = render('date-input', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-c-date-input')
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

      const $items = $('.govuk-c-date-input__item')
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

      const $firstItems = $('.govuk-c-date-input__item:first-child')
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

      const $firstInput = $('.govuk-c-date-input__item:first-child input')
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

      const $firstInput = $('.govuk-c-date-input__item:first-child input')
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

      const $firstItems = $('.govuk-c-date-input__item:first-child label')
      expect($firstItems.hasClass('govuk-c-date-input__label')).toBeTruthy()
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

      const $firstItems = $('.govuk-c-date-input__item:first-child input')
      expect($firstItems.hasClass('govuk-c-date-input__input')).toBeTruthy()
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

      const $firstItems = $('.govuk-c-date-input__item:first-child input')
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

      const $firstItems = $('.govuk-c-date-input__item:first-child input')
      expect($firstItems.attr('id')).toEqual('my-date-input-day')
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('date-input', examples['default'])

      const $component = $('.govuk-o-form-group > .govuk-c-fieldset > .govuk-c-date-input')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('date-input', examples['default'])

      expect(htmlWithClassName($, '.govuk-c-date-input__label')).toMatchSnapshot()
    })
  })

  it('passes through fieldset params without breaking', () => {
    const $ = render('date-input', examples['default'])

    expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
  })

  it('passes through html fieldset params without breaking', () => {
    const $ = render('date-input', {
      id: 'dob',
      name: 'dob',
      fieldset: {
        legendHtml: 'What is your <b>date of birth</b>?',
        legendHintHtml: 'For example, <b>31 3 1980</b>'
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

    expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
  })
})
