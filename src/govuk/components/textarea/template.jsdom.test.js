const { getExamples, render } = require('@govuk-frontend/lib/components')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Textarea', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('textarea')
  })

  describe('default example', () => {
    it('autopopulates default id from name', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('id', $component.getAttribute('name'))
    })

    it('renders with name', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('name', 'more-detail')
    })

    it('renders with default number of rows', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('rows', '5')
    })

    it('renders with a form group wrapper', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $formGroup = document.querySelector('.govuk-form-group')
      expect($formGroup).toBeInTheDocument()
    })
  })

  describe('custom options', () => {
    it('renders with id', () => {
      document.body.innerHTML = render('textarea', examples.id)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('id', 'textarea-id')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('textarea', examples.classes)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveClass('app-textarea--custom-modifier')
    })

    it('renders with value', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with default value']
      )

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveValue('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('textarea', examples.attributes)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('data-attribute', 'my data value')
    })

    it('renders with aria-describedby', () => {
      document.body.innerHTML = render('textarea', examples['with describedBy'])

      const $component = document.querySelector('.govuk-textarea')

      // Because aria-describedby references test-target-element which has no
      // content, expect on the attribute instead of toHaveAccessibleDescription
      expect($component).toHaveAttribute(
        'aria-describedby',
        'test-target-element'
      )
    })

    it('renders with rows', () => {
      document.body.innerHTML = render('textarea', examples['with custom rows'])

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('rows', '8')
    })

    it('renders with a form group wrapper that has extra classes', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with optional form-group classes']
      )

      const $formGroup = document.querySelector('.govuk-form-group')
      expect($formGroup).toHaveClass('extra-class')
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders with spellcheck attribute set to true', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with spellcheck enabled']
      )

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('spellcheck', 'true')
    })

    it('renders with spellcheck attribute set to false', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with spellcheck disabled']
      )

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('spellcheck', 'false')
    })

    it('renders without spellcheck attribute by default', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $component = document.querySelector('.govuk-textarea')
      expect($component).not.toHaveAttribute('spellcheck')
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      document.body.innerHTML = render('textarea', examples['with hint'])

      expect(document.querySelector('.govuk-hint').outerHTML).toMatchSnapshot()
    })

    it('associates the textarea as "described by" the hint', () => {
      document.body.innerHTML = render('textarea', examples['with hint'])

      const $textarea = document.querySelector('.govuk-textarea')

      expect($textarea).toHaveAccessibleDescription(
        "Don't include personal or financial information, eg your National " +
          'Insurance number or credit card details.'
      )
    })

    it('associates the textarea as "described by" the hint and parent fieldset', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with hint and described by']
      )

      const $textarea = document.querySelector('.govuk-textarea')
      const hintId = document.querySelector('.govuk-hint').id

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WORD_BOUNDARY}`
      )

      // Because aria-describedby references test-target-element which has no
      // content, expect on the attribute instead of toHaveAccessibleDescription
      expect($textarea).toHaveAttribute(
        'aria-describedby',
        expect.stringMatching(describedBy)
      )
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with error message']
      )

      expect(
        document.querySelector('.govuk-error-message').outerHTML
      ).toMatchSnapshot()
    })

    it('associates the textarea as "described by" the error message', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with error message']
      )

      const $component = document.querySelector('.govuk-textarea')

      expect($component).toHaveAccessibleDescription(
        'Error: You must provide an explanation'
      )
    })

    it('associates the textarea as "described by" the error message and parent fieldset', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with error message and described by']
      )

      const $component = document.querySelector('.govuk-textarea')
      const errorMessageId = document.querySelector('.govuk-error-message').id

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      // Because aria-describedby references test-target-element which has no
      // content, expect on the attribute instead of toHaveAccessibleDescription
      expect($component).toHaveAttribute(
        'aria-describedby',
        expect.stringMatching(describedBy)
      )
    })

    it('adds the error class to the textarea', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with error message']
      )

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveClass('govuk-textarea--error')
    })

    it('renders with a form group wrapper that has an error state', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with error message']
      )

      const $formGroup = document.querySelector('.govuk-form-group')
      expect($formGroup).toHaveClass('govuk-form-group--error')
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the textarea as described by both the hint and the error message', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with hint and error message']
      )

      const $component = document.querySelector('.govuk-textarea')

      expect($component).toHaveAccessibleDescription(
        'Hint Error: Error message'
      )
    })

    it('associates the textarea as described by the hint, error message and parent fieldset', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with hint, error message and described by']
      )

      const $component = document.querySelector('.govuk-textarea')
      const errorMessageId = document.querySelector('.govuk-error-message').id
      const hintId = document.querySelector('.govuk-hint').id

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      // Because aria-describedby references test-target-element which has no
      // content, expect on the attribute instead of toHaveAccessibleDescription
      expect($component).toHaveAttribute(
        'aria-describedby',
        expect.stringMatching(describedByCombined)
      )
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $component = document.querySelector(
        '.govuk-form-group > .govuk-textarea'
      )
      expect($component).toBeInTheDocument()
    })

    it('renders with label', () => {
      document.body.innerHTML = render('textarea', examples.default)

      expect(document.querySelector('.govuk-label').outerHTML).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the textarea "id"', () => {
      document.body.innerHTML = render('textarea', examples.default)

      const $label = document.querySelector('.govuk-label')
      expect($label).toHaveAttribute('for', 'more-detail')
    })

    it('renders label as page heading', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with label as page heading']
      )

      const $label = document.querySelector('.govuk-label')
      expect(document.querySelector('.govuk-label-wrapper')).toBeInTheDocument()
      expect($label).toHaveAttribute('for', 'textarea-with-page-heading')
    })
  })

  describe('when it includes an autocomplete attribute', () => {
    it('renders the autocomplete attribute', () => {
      document.body.innerHTML = render(
        'textarea',
        examples['with autocomplete attribute']
      )

      const $component = document.querySelector('.govuk-textarea')
      expect($component).toHaveAttribute('autocomplete', 'street-address')
    })
  })
})
