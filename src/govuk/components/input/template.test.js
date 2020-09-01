/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('input')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Input', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('input', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('input', {
        classes: 'app-input--custom-modifier'
      })

      const $component = $('.govuk-input')
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('input', {
        id: 'my-input'
      })

      const $component = $('.govuk-input')
      expect($component.attr('id')).toEqual('my-input')
    })

    it('renders with name', () => {
      const $ = render('input', {
        name: 'my-input-name'
      })

      const $component = $('.govuk-input')
      expect($component.attr('name')).toEqual('my-input-name')
    })

    it('renders with type="text" by default', () => {
      const $ = render('input', {})

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('text')
    })

    it('allows you to override the type', () => {
      const $ = render('input', {
        type: 'number'
      })

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('number')
    })

    it('renders with value', () => {
      const $ = render('input', {
        value: 'QQ 12 34 56 C'
      })

      const $component = $('.govuk-input')
      expect($component.val()).toEqual('QQ 12 34 56 C')
    })

    it('renders with aria-describedby', () => {
      const describedById = 'some-id'

      const $ = render('input', {
        describedBy: describedById
      })

      const $component = $('.govuk-input')
      expect($component.attr('aria-describedby')).toMatch(describedById)
    })

    it('renders with attributes', () => {
      const $ = render('input', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-input')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('input', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('input', {
        formGroup: {
          classes: 'extra-class'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })

    it('doesn\'t render the input wrapper', () => {
      const $ = render('input', examples.default)

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.length).toBeFalsy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('input', {
        id: 'input-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('input', {
        id: 'input-with-hint',
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      const $input = $('.govuk-input')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(hintId)
    })

    it('associates the input as "described by" the hint and parent fieldset', () => {
      const describedById = 'some-id'

      const $ = render('input', {
        id: 'input-with-hint',
        describedBy: describedById,
        hint: {
          text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
        }
      })

      const $input = $('.govuk-input')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message'
        }
      })

      const $input = $('.govuk-input')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('associates the input as "described by" the error message and parent fieldset', () => {
      const describedById = 'some-id'

      const $ = render('input', {
        id: 'input-with-error',
        describedBy: describedById,
        errorMessage: {
          text: 'Error message'
        }
      })

      const $input = $('.govuk-input')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($input.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('includes the error class on the input', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $component = $('.govuk-input')
      expect($component.hasClass('govuk-input--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders with spellcheck attribute set to true', () => {
      const $ = render('input', {
        spellcheck: true
      })

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toEqual('true')
    })

    it('renders with spellcheck attribute set to false', () => {
      const $ = render('input', {
        name: 'my-input-name',
        spellcheck: false
      })

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toEqual('false')
    })

    it('renders without spellcheck attribute by default', () => {
      const $ = render('input', {
        name: 'my-input-name'
      })

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toBeUndefined()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('input', {
        errorMessage: {
          text: 'Error message'
        },
        hint: {
          text: 'Hint'
        }
      })

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })

    it('associates the input as described by the hint, error message and parent fieldset', () => {
      const describedById = 'some-id'

      const $ = render('input', {
        describedBy: describedById,
        errorMessage: {
          text: 'Error message'
        },
        hint: {
          text: 'Hint'
        }
      })

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(combinedIds)
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number'
        }
      })

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number'
        }
      })

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number'
        }
      })

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('my-input')
    })
  })

  describe('when it includes an autocomplete attribute', () => {
    it('renders the autocomplete attribute', () => {
      const $ = render('input', {
        id: 'input-with-autocomplete',
        autocomplete: 'postal-code'
      })

      const $component = $('.govuk-input')
      expect($component.attr('autocomplete')).toEqual('postal-code')
    })
  })

  describe('when it includes an inputmode', () => {
    it('renders with an inputmode attached to the input', () => {
      const $ = render('input', {
        inputmode: 'decimal'
      })

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.attr('inputmode')).toEqual('decimal')
    })
  })

  describe('when it includes a prefix', () => {
    it('renders the input wrapper', () => {
      const $ = render('input', examples['with prefix'])

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.length).toBeTruthy()
    })
    it('renders the prefix inside the wrapper', () => {
      const $ = render('input', examples['with prefix'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')
      expect($prefix.length).toBeTruthy()
    })
    it('hides the prefix from screen readers using the aria-hidden attribute', () => {
      const $ = render('input', examples['with prefix'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')
      expect($prefix.attr('aria-hidden')).toEqual('true')
    })
    it('allows prefix text to be passed whilst escaping HTML entities', () => {
      const $ = render('input', examples['with prefix with html as text'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')

      expect($prefix.html()).toEqual('&lt;span&gt;&#xA3;&lt;/span&gt;')
    })
    it('allows prefix HTML to be passed un-escaped', () => {
      const $ = render('input', examples['with prefix with html'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')

      expect($prefix.html()).toEqual('<span>&#xA3;</span>')
    })
    it('renders with classes', () => {
      const $ = render('input', examples['with prefix with classes'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')
      expect($prefix.hasClass('app-input__prefix--custom-modifier')).toBeTruthy()
    })
    it('renders with attributes', () => {
      const $ = render('input', examples['with prefix with attributes'])

      const $prefix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix')
      expect($prefix.attr('data-attribute')).toEqual('value')
    })
  })

  describe('when it includes a suffix', () => {
    it('renders the input wrapper', () => {
      const $ = render('input', examples['with suffix'])

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.length).toBeTruthy()
    })
    it('renders the suffix inside the wrapper', () => {
      const $ = render('input', examples['with suffix'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')
      expect($suffix.length).toBeTruthy()
    })
    it('hides the suffix from screen readers using the aria-hidden attribute', () => {
      const $ = render('input', examples['with suffix'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')
      expect($suffix.attr('aria-hidden')).toEqual('true')
    })
    it('allows suffix text to be passed whilst escaping HTML entities', () => {
      const $ = render('input', examples['with suffix with html as text'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')

      expect($suffix.html()).toEqual('&lt;span&gt;kg&lt;/span&gt;')
    })
    it('allows suffix HTML to be passed un-escaped', () => {
      const $ = render('input', examples['with suffix with html'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')

      expect($suffix.html()).toEqual('<span>kg</span>')
    })
    it('renders with classes', () => {
      const $ = render('input', examples['with suffix with classes'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')
      expect($suffix.hasClass('app-input__suffix--custom-modifier')).toBeTruthy()
    })
    it('renders with attributes', () => {
      const $ = render('input', examples['with suffix with attributes'])

      const $suffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix')
      expect($suffix.attr('data-attribute')).toEqual('value')
    })
  })

  describe('when it includes both a prefix and a suffix', () => {
    it('renders the prefix before the suffix', () => {
      const $ = render('input', examples['with prefix and suffix'])

      const $prefixBeforeSuffix = $('.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix ~ .govuk-input__suffix')
      expect($prefixBeforeSuffix.length).toBeTruthy()
    })
  })
})
