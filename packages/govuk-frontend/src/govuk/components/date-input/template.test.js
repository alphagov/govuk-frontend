const { render } = require('@govuk-frontend/helpers/nunjucks')
const { htmlWithClassName } = require('@govuk-frontend/helpers/tests')
const { getExamples } = require('@govuk-frontend/lib/components')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Date input', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('date-input')
  })

  describe('default example', () => {
    it('renders with id', () => {
      const $ = render('date-input', examples.default)

      const $component = $('.govuk-date-input')
      expect($component.attr('id')).toBe('date-input')
    })

    it('renders default inputs', () => {
      const $ = render('date-input', examples.default)

      const $items = $('.govuk-date-input__item')
      expect($items).toHaveLength(3)
    })

    it('renders item with capitalised label text', () => {
      const $ = render('date-input', examples.default)

      const $firstItems = $('.govuk-date-input__item:first-child')
      expect($firstItems.text().trim()).toBe('Day')
    })

    it('renders inputs with type="text"', () => {
      const $ = render('date-input', examples.default)

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('type')).toBe('text')
    })

    it('renders inputs with inputmode="numeric"', () => {
      const $ = render('date-input', examples.default)

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('inputmode')).toBe('numeric')
    })

    it('renders item with implicit class for label', () => {
      const $ = render('date-input', examples.default)

      const $firstItems = $('.govuk-date-input__item:first-child label')
      expect($firstItems.hasClass('govuk-date-input__label')).toBeTruthy()
    })

    it('renders item with implicit class for input', () => {
      const $ = render('date-input', examples.default)

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.hasClass('govuk-date-input__input')).toBeTruthy()
    })

    it('renders with a form group wrapper', () => {
      const $ = render('date-input', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('items', () => {
    it('renders defaults when an empty item array is provided', () => {
      const $ = render('date-input', examples['with empty items'])

      const $items = $('.govuk-date-input__item')
      expect($items).toHaveLength(3)
    })

    it('renders with default items', () => {
      const $ = render('date-input', examples.default)

      const $items = $('.govuk-date-input__item')
      const $firstItemInput = $(
        '.govuk-date-input:first-child .govuk-date-input__input'
      )

      expect($items).toHaveLength(3)
      expect($firstItemInput.attr('name')).toBe('day')
    })

    it('renders item with suffixed name for input', () => {
      const $ = render('date-input', examples['complete question'])

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('name')).toBe('dob-day')
    })

    it('renders items with id', () => {
      const $ = render('date-input', examples['with id on items'])

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('id')).toBe('day')
    })

    it('renders item with suffixed id for input', () => {
      const $ = render('date-input', examples['suffixed id'])

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('id')).toBe('my-date-input-day')
    })

    it('renders items with value', () => {
      const $ = render('date-input', examples['with values'])

      const $lastItems = $('.govuk-date-input__item:last-child input')
      expect($lastItems.val()).toBe('2018')
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('date-input', examples.classes)

      const $component = $('.govuk-date-input')
      expect(
        $component.hasClass('app-date-input--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('date-input', examples.attributes)

      const $component = $('.govuk-date-input')
      expect($component.attr('data-attribute')).toBe('my data value')
    })

    it('renders with item attributes', () => {
      const $ = render('date-input', examples['with input attributes'])

      const $input1 = $('.govuk-date-input__item:nth-of-type(1) input')
      const $input2 = $('.govuk-date-input__item:nth-of-type(2) input')
      const $input3 = $('.govuk-date-input__item:nth-of-type(3) input')

      expect($input1.attr('data-example-day')).toBe('day')
      expect($input2.attr('data-example-month')).toBe('month')
      expect($input3.attr('data-example-year')).toBe('year')
    })

    it('renders items with name', () => {
      const $ = render('date-input', examples['with nested name'])

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('name')).toBe('day[dd]')
    })

    it('renders inputs with custom pattern attribute', () => {
      const $ = render('date-input', examples['custom pattern'])

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('pattern')).toBe('[0-8]*')
    })

    it('renders inputs with custom inputmode="text"', () => {
      const $ = render('date-input', examples['custom inputmode'])

      const $firstInput = $('.govuk-date-input__item:first-child input')
      expect($firstInput.attr('inputmode')).toBe('text')
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render(
        'date-input',
        examples['with optional form-group classes']
      )

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('date-input', examples['complete question'])
      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('date-input', examples['complete question'])

      const $fieldset = $('.govuk-fieldset')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WORD_BOUNDARY}`
      )

      expect($fieldset.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the fieldset as "described by" the hint and parent fieldset', () => {
      const $ = render('date-input', examples['with hint and describedBy'])

      const $fieldset = $('.govuk-fieldset')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WORD_BOUNDARY}`
      )

      expect($fieldset.attr('aria-describedby')).toMatch(describedBy)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('date-input', examples['with errors only'])
      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('uses the id as a prefix for the error message id', () => {
      const $ = render('date-input', examples['with errors only'])

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toBe('dob-errors-error')
    })

    it('associates the fieldset as "described by" the error message', () => {
      const $ = render('date-input', examples['with errors only'])

      const $fieldset = $('.govuk-fieldset')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($fieldset.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the fieldset as "described by" the error message and parent fieldset', () => {
      const $ = render('date-input', examples['with error and describedBy'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('aria-describedby')).toMatch(
        'test-target-element dob-errors-error'
      )
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('date-input', examples['with errors only'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('sets the `group` role on the fieldset to force JAWS18 to announce the hint and error message', () => {
      const $ = render('date-input', examples['with errors and hint'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('role')).toBe('group')
    })

    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('date-input', examples['with errors and hint'])

      const $fieldset = $('.govuk-fieldset')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($fieldset.attr('aria-describedby')).toMatch(describedByCombined)
    })

    it('associates the fieldset as described by the hint, error message and parent fieldset', () => {
      const $ = render('date-input', examples['with errors and hint'])

      const $fieldset = $('.govuk-fieldset')

      expect($fieldset.attr('aria-describedby')).toMatch(
        'dob-errors-hint dob-errors-error'
      )
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('date-input', examples['complete question'])

      const $component = $(
        '.govuk-form-group > .govuk-fieldset > .govuk-date-input'
      )
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('date-input', examples.default)

      expect(htmlWithClassName($, '.govuk-date-input__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('date-input', examples['complete question'])

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })

  it('passes through html fieldset params without breaking', () => {
    const $ = render('date-input', examples['fieldset html'])

    expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
  })

  it('can have classes for individual items', () => {
    const $ = render('date-input', examples['items with classes'])

    const $dayInput = $('[name="day"]')
    const $monthInput = $('[name="month"]')
    const $yearInput = $('[name="year"]')
    expect($dayInput.hasClass('app-date-input__day')).toBeTruthy()
    expect($monthInput.hasClass('app-date-input__month')).toBeTruthy()
    expect($yearInput.hasClass('app-date-input__year')).toBeTruthy()
  })

  it('does not set classes as undefined if none are defined', () => {
    const $ = render('date-input', examples['items without classes'])

    const $dayInput = $('[name="day"]')
    const $monthInput = $('[name="month"]')
    const $yearInput = $('[name="year"]')
    expect($dayInput.hasClass('undefined')).toBeFalsy()
    expect($monthInput.hasClass('undefined')).toBeFalsy()
    expect($yearInput.hasClass('undefined')).toBeFalsy()
  })

  describe('when it includes autocomplete attributes', () => {
    it('renders the autocomplete attribute', () => {
      const $ = render('date-input', examples['with autocomplete values'])

      const $firstItems = $('.govuk-date-input__item:first-child input')
      expect($firstItems.attr('autocomplete')).toBe('bday-day')
    })
  })
})
