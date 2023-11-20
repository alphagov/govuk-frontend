const { render } = require('@govuk-frontend/helpers/nunjucks')
const { htmlWithClassName } = require('@govuk-frontend/helpers/tests')
const { getExamples } = require('@govuk-frontend/lib/components')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Select', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('select')
  })

  describe('by default', () => {
    it('renders with id', () => {
      const $ = render('select', examples.default)

      const $component = $('.govuk-select')
      expect($component.attr('id')).toEqual('select-1')
    })

    it('renders with name', () => {
      const $ = render('select', examples.default)

      const $component = $('.govuk-select')
      expect($component.attr('name')).toEqual('select-1')
    })

    it('renders with items', () => {
      const $ = render('select', examples.default)
      const $items = $('.govuk-select option')
      expect($items.length).toEqual(3)
    })

    it('includes the value attribute', () => {
      const $ = render('select', examples.default)

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.attr('value')).toEqual('1')
    })

    it('includes the value attribute when the value option is an empty string', () => {
      const $ = render('select', examples['with falsey values'])

      const $firstItem = $('.govuk-select option:nth(0)')
      expect($firstItem.attr('value')).toEqual('')
    })

    it('includes the value attribute when the value option is false', () => {
      const $ = render('select', examples['with falsey values'])

      const $secondItem = $('.govuk-select option:nth(1)')
      expect($secondItem.attr('value')).toEqual('false')
    })

    it('includes the value attribute when the value option is 0', () => {
      const $ = render('select', examples['with falsey values'])

      const $thirdItem = $('.govuk-select option:nth(2)')
      expect($thirdItem.attr('value')).toEqual('0')
    })

    it('omits the value attribute if no value option is provided', () => {
      const $ = render('select', examples['without values'])

      const $firstItem = $('.govuk-select option:first-child')
      // Ideally we'd test for $firstItem.attr('value') == undefined but it's
      // broken in Cheerio – https://github.com/cheeriojs/cheerio/issues/3237
      expect($firstItem.toString()).not.toContain('value')
    })

    it('renders item with text', () => {
      const $ = render('select', examples.default)

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.text()).toEqual('GOV.UK frontend option 1')
    })

    it('renders item with selected', () => {
      const $ = render('select', examples.default)

      const $selectedItem = $('.govuk-select option:nth-child(2)')
      expect($selectedItem.attr('selected')).toBeTruthy()
    })

    it('selects options using selected value', () => {
      const $ = render('select', examples['with selected value'])

      const $selectedItem = $('option[value="2"]')
      expect($selectedItem.attr('selected')).toBeTruthy()
    })

    it('selects options with implicit value using selected value', () => {
      const $ = render('select', examples['without values with selected value'])

      const $selectedItem = $("option:contains('Green')")
      expect($selectedItem.attr('selected')).toBeTruthy()
    })

    it('allows item.selected to override value', () => {
      const $ = render('select', examples['item selected overrides value'])

      const $selectedItem = $('option[value="green"]')
      expect($selectedItem.attr('selected')).toBeUndefined()
    })

    it('renders item with disabled', () => {
      const $ = render('select', examples.default)

      const $disabledItem = $('.govuk-select option:last-child')
      expect($disabledItem.attr('disabled')).toBeTruthy()
    })

    it('renders with a form group wrapper', () => {
      const $ = render('select', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('select', examples['with optional form-group classes'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })

    it('renders without falsely items', () => {
      const $ = render('select', examples['with falsey items'])

      const $items = $('.govuk-select option')
      expect($items.length).toEqual(2)
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('select', examples['with full width override'])

      const $component = $('.govuk-select')
      expect($component.hasClass('govuk-!-width-full')).toBeTruthy()
    })

    it('renders with aria-describedby', () => {
      const $ = render('select', examples['with describedBy'])

      const $component = $('.govuk-select')
      expect($component.attr('aria-describedby')).toMatch('test-target-element')
    })

    it('renders with attributes', () => {
      const $ = render('select', examples.attributes)

      const $component = $('.govuk-select')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with attributes on items', () => {
      const $ = render('select', examples['attributes on items'])

      const $component = $('.govuk-select')

      const $firstInput = $component.find('option:first-child')
      expect($firstInput.attr('data-attribute')).toEqual('ABC')
      expect($firstInput.attr('data-second-attribute')).toEqual('DEF')

      const $secondInput = $component.find('option:last-child')
      expect($secondInput.attr('data-attribute')).toEqual('GHI')
      expect($secondInput.attr('data-second-attribute')).toEqual('JKL')
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('select', examples.hint)

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the select as "described by" the hint', () => {
      const $ = render('select', examples.hint)

      const $select = $('.govuk-select')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WORD_BOUNDARY}`
      )

      expect($select.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the select as "described by" the hint and parent fieldset', () => {
      const $ = render('select', examples['hint and describedBy'])

      const $select = $('.govuk-select')

      expect($select.attr('aria-describedby')).toMatch('test-target-element')
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('select', examples.error)

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the select as "described by" the error message', () => {
      const $ = render('select', examples.error)

      const $input = $('.govuk-select')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($input.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the select as "described by" the error message and parent fieldset', () => {
      const $ = render('select', examples['error and describedBy'])

      const $input = $('.govuk-select')

      expect($input.attr('aria-describedby')).toMatch('test-target-element')
    })

    it('adds the error class to the select', () => {
      const $ = render('select', examples.error)

      const $component = $('.govuk-select')
      expect($component.hasClass('govuk-select--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('select', examples.error)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the select as described by both the hint and the error message', () => {
      const $ = render('select', examples['with hint text and error message'])

      const $component = $('.govuk-select')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedByCombined)
    })

    it('associates the select as described by the hint, error message and parent fieldset', () => {
      const $ = render('select', examples['with hint text and error message'])

      const $component = $('.govuk-select')

      expect($component.attr('aria-describedby')).toMatch(
        'select-2-hint select-2-error'
      )
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('select', examples['with hint text and error message'])

      const $component = $('.govuk-form-group > .govuk-select')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('select', examples.default)

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the select "id"', () => {
      const $ = render('select', examples.default)

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('select-1')
    })
  })
})
