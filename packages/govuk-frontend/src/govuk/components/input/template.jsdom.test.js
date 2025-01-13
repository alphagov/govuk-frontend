const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Input', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('input')
  })

  describe('default example', () => {
    let $component
    let $label

    beforeAll(() => {
      document.body.innerHTML = render('input', examples.default)
      $component = document.querySelector('.govuk-input')
      $label = document.querySelector('.govuk-label')
    })

    it('sets the `name` attribute based on the `name` option', () => {
      expect($component).toHaveAttribute('name', 'test-name')
    })

    it('sets the `id` attribute based on the `name` option', () => {
      const inputName = $component.getAttribute('name')
      expect($component).toHaveAttribute('id', inputName)
    })

    it('sets the `type` attribute to a default value of "text"', () => {
      expect($component).toHaveAttribute('type', 'text')
    })

    it('includes a form group wrapper', () => {
      const $formGroup = document.querySelector('.govuk-form-group')

      expect($formGroup).toBeInTheDocument()
      expect($formGroup).toContainElement($component)
    })

    it('includes a label', () => {
      expect($label).toBeInTheDocument()
    })

    it('the input is named by the label', () => {
      expect($component).toHaveAccessibleName($label.textContent.trim())
    })

    it('does not include the input wrapper', () => {
      const $wrapper = document.querySelector(
        '.govuk-form-group > .govuk-input__wrapper'
      )

      expect($wrapper).toBeNull()
    })

    it.each([
      'autocapitalize',
      'autocomplete',
      'disabled',
      'inputmode',
      'pattern',
      'spellcheck'
    ])('does not set the `%s` attribute', (attribute) => {
      expect($component).not.toHaveAttribute(attribute)
    })
  })

  describe('custom options', () => {
    it('sets the `id` attribute based on the `id` option', () => {
      document.body.innerHTML = render('input', examples.id)

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('id', 'test-id')
    })

    it('includes additional classes from the `classes` option', () => {
      document.body.innerHTML = render('input', examples.classes)

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveClass('app-input--custom-modifier')
    })

    it('sets the `type` attribute based on the `type` option', () => {
      document.body.innerHTML = render('input', examples['custom type'])

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('type', 'number')
    })

    it('sets the `pattern` attribute based on the `pattern` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with pattern attribute']
      )

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('pattern', '[0-9]*')
    })

    it('sets the `value` attribute based on the `value` option', () => {
      document.body.innerHTML = render('input', examples.value)

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveValue('QQ 12 34 56 C')
    })

    it('sets the `value` attribute based on a `value` of 0', () => {
      document.body.innerHTML = render('input', examples['zero value'])

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveValue('0')
    })

    it('sets the `aria-describedby` attribute based on the `describedBy` option', () => {
      document.body.innerHTML = render('input', examples['with describedBy'])

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute(
        'aria-describedby',
        'test-target-element'
      )
    })

    it('sets any additional attributes based on the `attributes` option', () => {
      document.body.innerHTML = render('input', examples.attributes)

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('data-attribute', 'my data value')
    })

    it('includes additional classes from the `formGroup.classes` option on the form group', () => {
      document.body.innerHTML = render(
        'input',
        examples['with optional form-group classes']
      )

      const $formGroup = document.querySelector('.govuk-form-group')
      expect($formGroup).toHaveClass('extra-class')
    })
  })

  describe('when a hint is passed', () => {
    let $component
    let $hint

    beforeAll(() => {
      document.body.innerHTML = render('input', examples['with hint text'])

      $component = document.querySelector('.govuk-input')
      $hint = document.querySelector('.govuk-hint')
    })

    it('includes the hint', () => {
      expect($hint).toBeInTheDocument()
    })

    it('associates the input as described by the hint', () => {
      expect($component).toHaveAccessibleDescription($hint.textContent.trim())
    })

    it('associates the input as described by both the hint and the `describedBy` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['hint with describedBy']
      )

      const $additionalDescription = document.createElement('p')
      $additionalDescription.id = 'test-target-element'
      $additionalDescription.textContent = 'Additional description'
      document.body.appendChild($additionalDescription)

      const $input = document.querySelector('.govuk-input')
      const $hint = document.querySelector('.govuk-hint')

      expect($input).toHaveAccessibleDescription(
        [$additionalDescription, $hint]
          .map((el) => el.textContent.trim())
          .join(' ')
      )
    })
  })

  describe('when an error message is passed', () => {
    let $component
    let $errorMessage

    beforeAll(() => {
      document.body.innerHTML = render('input', examples['with error message'])

      $component = document.querySelector('.govuk-input')
      $errorMessage = document.querySelector('.govuk-error-message')
    })

    it('includes the error message', () => {
      expect($errorMessage).toBeInTheDocument()
    })

    it('associates the input as described by the error message', () => {
      expect($component).toHaveAccessibleDescription(
        $errorMessage.textContent.trim()
      )
    })

    it('associates the input as described by the error message and the `describedBy` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['error with describedBy']
      )

      const $additionalDescription = document.createElement('p')
      $additionalDescription.id = 'test-target-element'
      $additionalDescription.textContent = 'Additional description'
      document.body.appendChild($additionalDescription)

      const $input = document.querySelector('.govuk-input')
      const $errorMessage = document.querySelector('.govuk-error-message')

      expect($input).toHaveAccessibleDescription(
        [$additionalDescription, $errorMessage]
          .map((el) => el.textContent.trim())
          .join(' ')
      )
    })

    it('includes the error modifier class on the input', () => {
      expect($component).toHaveClass('govuk-input--error')
    })

    it('includes the error modifier class on the form group wrapper', () => {
      const $formGroup = document.querySelector('.govuk-form-group')

      expect($formGroup).toHaveClass('govuk-form-group--error')
    })
  })

  describe('when both a hint and an error message are passed', () => {
    it('associates the input as described by both the hint and the error message', () => {
      document.body.innerHTML = render('input', examples['with error and hint'])

      const $component = document.querySelector('.govuk-input')
      const $errorMessage = document.querySelector('.govuk-error-message')
      const $hint = document.querySelector('.govuk-hint')

      expect($component).toHaveAccessibleDescription(
        [$hint, $errorMessage].map((el) => el.textContent.trim()).join(' ')
      )
    })

    it('associates the input as described by the hint, error message and the `describedBy` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with error, hint and describedBy']
      )

      const $additionalDescription = document.createElement('p')
      $additionalDescription.id = 'test-target-element'
      $additionalDescription.textContent = 'Additional description'
      document.body.appendChild($additionalDescription)

      const $component = document.querySelector('.govuk-input')
      const $errorMessage = document.querySelector('.govuk-error-message')
      const $hint = document.querySelector('.govuk-hint')

      expect($component).toHaveAccessibleDescription(
        [$additionalDescription, $hint, $errorMessage]
          .map((el) => el.textContent.trim())
          .join(' ')
      )
    })
  })

  describe('when the `spellcheck` option is set', () => {
    it('sets the `spellcheck` attribute to "true" if the option is true', () => {
      document.body.innerHTML = render(
        'input',
        examples['with spellcheck enabled']
      )

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('spellcheck', 'true')
    })

    it('sets the `spellcheck` attribute to "false" if the option is false', () => {
      document.body.innerHTML = render(
        'input',
        examples['with spellcheck disabled']
      )

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('spellcheck', 'false')
    })
  })

  describe('when the `autocapitalize` option is set', () => {
    it('sets the `autocapitalize` attribute based on the option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with autocapitalize turned off']
      )

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('autocapitalize', 'none')
    })
  })

  describe('when the `autocomplete` option is set', () => {
    it('sets the `autocomplete` attribute based on the option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with autocomplete attribute']
      )

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('autocomplete', 'postal-code')
    })
  })

  describe('when the `inputmode` option is set', () => {
    it('sets the `inputmode` attribute based on the option', () => {
      document.body.innerHTML = render('input', examples.inputmode)

      const $component = document.querySelector('.govuk-input')
      expect($component).toHaveAttribute('inputmode', 'decimal')
    })
  })

  describe('when the `disabled` option is set', () => {
    it('disables the input', () => {
      document.body.innerHTML = render('input', examples.disabled)

      const $component = document.querySelector('.govuk-input')
      expect($component).toBeDisabled()
    })
  })

  describe('when it includes a prefix', () => {
    let $wrapper
    let $prefix

    beforeAll(() => {
      document.body.innerHTML = render('input', examples['with prefix'])

      $wrapper = document.querySelector('.govuk-input__wrapper')
      $prefix = document.querySelector('.govuk-input__prefix')
    })

    it('renders the input wrapper', () => {
      expect($wrapper).toBeInTheDocument()
    })

    it('renders the prefix inside the wrapper', () => {
      expect($wrapper).toContainElement($prefix)
    })

    it('renders the text in the prefix', () => {
      expect($prefix).toHaveTextContent('£')
    })

    it('hides the prefix from screen readers using `aria-hidden`', () => {
      expect($prefix).toHaveAttribute('aria-hidden', 'true')
    })

    it('escapes HTML entities when using the `text` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with html as text']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toHaveTextContent('<span>£</span>')
    })

    it('allows HTML to be passed when using the `html` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with html']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toContainHTML('<span>£</span>')
    })

    it('includes additional classes from the `prefix.classes` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with classes']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toHaveClass('app-input__prefix--custom-modifier')
    })

    it('sets additional attributes from the `prefix.attributes` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with attributes']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toHaveAttribute('data-attribute', 'value')
    })
  })

  describe('when it includes a suffix', () => {
    let $wrapper
    let $suffix

    beforeAll(() => {
      document.body.innerHTML = render('input', examples['with suffix'])

      $wrapper = document.querySelector('.govuk-input__wrapper')
      $suffix = document.querySelector('.govuk-input__suffix')
    })

    it('renders the input wrapper', () => {
      expect($wrapper).toBeInTheDocument()
    })

    it('renders the suffix inside the wrapper', () => {
      expect($wrapper).toContainElement($suffix)
    })

    it('renders the text in the suffix', () => {
      expect($suffix).toHaveTextContent('kg')
    })

    it('hides the suffix from screen readers using `aria-hidden`', () => {
      expect($suffix).toHaveAttribute('aria-hidden', 'true')
    })

    it('escapes HTML entities when using the `text` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with suffix with html as text']
      )
      const $suffix = document.querySelector('.govuk-input__suffix')

      expect($suffix).toHaveTextContent('<span>kg</span>')
    })

    it('allows HTML to be passed when using the `html` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with suffix with html']
      )
      const $suffix = document.querySelector('.govuk-input__suffix')

      expect($suffix).toContainHTML('<span>kg</span>')
    })

    it('includes additional classes from the `prefix.classes` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with classes']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toHaveClass('app-input__prefix--custom-modifier')
    })

    it('sets additional attributes from the `prefix.attributes` option', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix with attributes']
      )
      const $prefix = document.querySelector('.govuk-input__prefix')

      expect($prefix).toHaveAttribute('data-attribute', 'value')
    })
  })

  describe('when it includes both a prefix and a suffix', () => {
    it('renders the prefix before the suffix', () => {
      document.body.innerHTML = render(
        'input',
        examples['with prefix and suffix']
      )

      expect(
        document.querySelector('.govuk-input__prefix ~ .govuk-input__suffix')
      ).toBeInTheDocument()
    })
  })

  describe('when it includes the input wrapper', () => {
    let $wrapper

    beforeAll(() => {
      document.body.innerHTML = render(
        'input',
        examples['with customised input wrapper']
      )
      $wrapper = document.querySelector('.govuk-input__wrapper')
    })

    it('includes additional classes from the `inputWrapper.classes` option', () => {
      expect($wrapper).toHaveClass('app-input-wrapper--custom-modifier')
    })

    it('renders the input wrapper with custom attributes', () => {
      expect($wrapper).toHaveAttribute('data-attribute', 'value')
    })
  })
})
