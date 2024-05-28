const { render } = require('@govuk-frontend/helpers/nunjucks')
const { htmlWithClassName } = require('@govuk-frontend/helpers/tests')
const { getExamples } = require('@govuk-frontend/lib/components')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Input', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('input')
  })

  describe('default example', () => {
    it('renders with id', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('id')).toBe('input-example')
    })

    it('renders with name', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('name')).toBe('test-name')
    })

    it('renders with type="text" by default', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('type')).toBe('text')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('input', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('input', examples.classes)

      const $component = $('.govuk-input')
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy()
    })

    it('allows you to override the type', () => {
      const $ = render('input', examples['custom type'])

      const $component = $('.govuk-input')
      expect($component.attr('type')).toBe('number')
    })

    it('renders with pattern attribute', () => {
      const $ = render('input', examples['with pattern attribute'])

      const $component = $('.govuk-input')
      expect($component.attr('pattern')).toBe('[0-9]*')
    })

    it('renders with value', () => {
      const $ = render('input', examples.value)

      const $component = $('.govuk-input')
      expect($component.val()).toBe('QQ 12 34 56 C')
    })

    it('renders with zero value', () => {
      const $ = render('input', examples['zero value'])

      const $component = $('.govuk-input')
      expect($component.val()).toBe('0')
    })

    it('renders with aria-describedby', () => {
      const $ = render('input', examples['with describedBy'])

      const $component = $('.govuk-input')
      expect($component.attr('aria-describedby')).toMatch('test-target-element')
    })

    it('renders with attributes', () => {
      const $ = render('input', examples.attributes)

      const $component = $('.govuk-input')
      expect($component.attr('data-attribute')).toBe('my data value')
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('input', examples['with optional form-group classes'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })

    it("doesn't render the input wrapper", () => {
      const $ = render('input', examples.default)

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.length).toBeFalsy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('input', examples['with hint text'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('input', examples['with hint text'])

      const $input = $('.govuk-input')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WORD_BOUNDARY}`
      )

      expect($input.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the input as "described by" the hint and parent fieldset', () => {
      const $ = render('input', examples['hint with describedBy'])

      const $input = $('.govuk-input')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WORD_BOUNDARY}`
      )

      expect($input.attr('aria-describedby')).toMatch(describedBy)
    })
  })

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('input', examples['with error message'])

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('input', examples['with error message'])

      const $input = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($input.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the input as "described by" the error message and parent fieldset', () => {
      const $ = render('input', examples['error with describedBy'])

      const $input = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($input.attr('aria-describedby')).toMatch(describedBy)
    })

    it('includes the error class on the input', () => {
      const $ = render('input', examples['with error message'])

      const $component = $('.govuk-input')
      expect($component.hasClass('govuk-input--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('input', examples['with error message'])

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders with spellcheck attribute set to true', () => {
      const $ = render('input', examples['with spellcheck enabled'])

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toBe('true')
    })

    it('renders with spellcheck attribute set to false', () => {
      const $ = render('input', examples['with spellcheck disabled'])

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toBe('false')
    })

    it('renders without spellcheck attribute by default', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toBeUndefined()
    })
  })

  describe('when it has the autocapitalize attribute', () => {
    it('renders without autocapitalize attribute by default', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('autocapitalize')).toBeUndefined()
    })

    it('renders with autocapitalize attribute when set', () => {
      const $ = render('input', examples['with autocapitalize turned off'])

      const $component = $('.govuk-input')
      expect($component.attr('autocapitalize')).toBe('none')
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('input', examples['with error and hint'])

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedByCombined)
    })

    it('associates the input as described by the hint, error message and parent fieldset', () => {
      const $ = render('input', examples['with error, hint and describedBy'])

      const $component = $('.govuk-input')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedByCombined)
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('input', examples.default)

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('input', examples.default)

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('input', examples.default)

      const $label = $('.govuk-label')
      expect($label.attr('for')).toBe('input-example')
    })
  })

  describe('when it includes an autocomplete attribute', () => {
    it('renders the autocomplete attribute', () => {
      const $ = render('input', examples['with autocomplete attribute'])

      const $component = $('.govuk-input')
      expect($component.attr('autocomplete')).toBe('postal-code')
    })
  })

  describe('when it includes an inputmode', () => {
    it('renders with an inputmode attached to the input', () => {
      const $ = render('input', examples.inputmode)

      const $component = $('.govuk-form-group > .govuk-input')
      expect($component.attr('inputmode')).toBe('decimal')
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

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )
      expect($prefix.length).toBeTruthy()
    })

    it('renders the text in the prefix', () => {
      const $ = render('input', examples['with prefix'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )

      expect($prefix.html()).toBe('£')
    })

    it('allows prefix text to be passed whilst escaping HTML entities', () => {
      const $ = render('input', examples['with prefix with html as text'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )

      expect($prefix.html()).toBe('&lt;span&gt;£&lt;/span&gt;')
    })

    it('allows prefix HTML to be passed un-escaped', () => {
      const $ = render('input', examples['with prefix with html'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )

      expect($prefix.html()).toBe('<span>£</span>')
    })

    it('hides the prefix from screen readers using the aria-hidden attribute', () => {
      const $ = render('input', examples['with prefix'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )
      expect($prefix.attr('aria-hidden')).toBe('true')
    })

    it('renders with classes', () => {
      const $ = render('input', examples['with prefix with classes'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )
      expect(
        $prefix.hasClass('app-input__prefix--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('input', examples['with prefix with attributes'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )
      expect($prefix.attr('data-attribute')).toBe('value')
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

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )
      expect($suffix.length).toBeTruthy()
    })

    it('renders the text in the prefix', () => {
      const $ = render('input', examples['with prefix'])

      const $prefix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix'
      )

      expect($prefix.html()).toBe('£')
    })

    it('allows suffix text to be passed whilst escaping HTML entities', () => {
      const $ = render('input', examples['with suffix with html as text'])

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )

      expect($suffix.html()).toBe('&lt;span&gt;kg&lt;/span&gt;')
    })

    it('allows suffix HTML to be passed un-escaped', () => {
      const $ = render('input', examples['with suffix with html'])

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )

      expect($suffix.html()).toBe('<span>kg</span>')
    })

    it('hides the suffix from screen readers using the aria-hidden attribute', () => {
      const $ = render('input', examples['with suffix'])

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )
      expect($suffix.attr('aria-hidden')).toBe('true')
    })

    it('renders with classes', () => {
      const $ = render('input', examples['with suffix with classes'])

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )
      expect(
        $suffix.hasClass('app-input__suffix--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('input', examples['with suffix with attributes'])

      const $suffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
      )
      expect($suffix.attr('data-attribute')).toBe('value')
    })
  })

  describe('when it includes both a prefix and a suffix', () => {
    it('renders the prefix before the suffix', () => {
      const $ = render('input', examples['with prefix and suffix'])

      const $prefixBeforeSuffix = $(
        '.govuk-form-group > .govuk-input__wrapper > .govuk-input__prefix ~ .govuk-input__suffix'
      )
      expect($prefixBeforeSuffix.length).toBeTruthy()
    })
  })

  describe('when it includes the input wrapper', () => {
    it('renders the input wrapper with custom classes', () => {
      const $ = render('input', examples['with customised input wrapper'])

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect(
        $wrapper.hasClass('app-input-wrapper--custom-modifier')
      ).toBeTruthy()
    })

    it('renders the input wrapper with custom attributes', () => {
      const $ = render('input', examples['with customised input wrapper'])

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.attr('data-attribute')).toBe('value')
    })
  })
})
