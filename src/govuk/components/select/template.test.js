/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

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

    it('renders item with value', () => {
      const $ = render('select', examples.default)

      const $firstItem = $('.govuk-select option:first-child')
      expect($firstItem.attr('value')).toEqual('1')
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
      const $ = render('select', examples['with falsey values'])

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
      expect($component.attr('aria-describedby')).toMatch('some-id')
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
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($select.attr('aria-describedby'))
        .toMatch(hintId)
    })

    it('associates the select as "described by" the hint and parent fieldset', () => {
      const $ = render('select', examples['hint and describedBy'])

      const $select = $('.govuk-select')

      expect($select.attr('aria-describedby'))
        .toMatch('some-id')
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
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('associates the select as "described by" the error message and parent fieldset', () => {
      const $ = render('select', examples['error and describedBy'])

      const $input = $('.govuk-select')

      expect($input.attr('aria-describedby'))
        .toMatch('some-id')
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

      const combinedIds = new RegExp(
        WORD_BOUNDARY + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })

    it('associates the select as described by the hint, error message and parent fieldset', () => {
      const $ = render('select', examples['with hint text and error message'])

      const $component = $('.govuk-select')

      expect($component.attr('aria-describedby'))
        .toMatch('select-2-hint select-2-error')
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
