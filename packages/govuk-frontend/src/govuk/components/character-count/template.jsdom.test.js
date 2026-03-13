const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Character count', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  describe('default example', () => {
    it('autopopulates default id from name', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('id', $component.getAttribute('name'))
    })

    it('renders with name', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('name', 'more-detail')
    })

    it('renders with default number of rows', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('rows', '5')
    })
  })

  describe('custom options', () => {
    it('renders with id', () => {
      document.body.innerHTML = render('character-count', examples.id)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('id', 'character-count-id')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('character-count', examples.classes)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveClass('app-character-count--custom-modifier')
    })

    it('renders with rows', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with custom rows']
      )

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('rows', '8')
    })

    it('renders with value', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with default value']
      )

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveValue('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('character-count', examples.attributes)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAttribute('data-attribute', 'my data value')
    })

    it('renders with formGroup', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['formGroup with classes']
      )

      const $component = document.querySelector('.govuk-form-group')
      expect($component).toHaveClass('app-character-count--custom-modifier')
    })
  })

  describe('count message', () => {
    it('renders with the amount of characters expected', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $countMessage = document.querySelector(
        '.govuk-character-count__message'
      )
      expect($countMessage).toHaveTextContent(
        'You can enter up to 10 characters'
      )
    })

    it('renders with the amount of words expected', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with word count']
      )

      const $countMessage = document.querySelector(
        '.govuk-character-count__message'
      )
      expect($countMessage).toHaveTextContent('You can enter up to 10 words')
    })

    it('is associated with the textarea', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $textarea = document.querySelector('.govuk-js-character-count')

      expect($textarea).toHaveAccessibleDescription(
        'You can enter up to 10 characters'
      )
    })

    it('renders with custom classes', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['custom classes on countMessage']
      )

      const $countMessage = document.querySelector(
        '.govuk-character-count__message'
      )
      expect($countMessage).toHaveClass('app-custom-count-message')
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders the textarea with spellcheck attribute set to true', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['spellcheck enabled']
      )

      const $component = document.querySelector(
        '.govuk-character-count .govuk-textarea'
      )
      expect($component).toHaveAttribute('spellcheck', 'true')
    })

    it('renders the textarea with spellcheck attribute set to false', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['spellcheck disabled']
      )

      const $component = document.querySelector(
        '.govuk-character-count .govuk-textarea'
      )
      expect($component).toHaveAttribute('spellcheck', 'false')
    })

    it('renders the textarea without spellcheck attribute by default', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $component = document.querySelector(
        '.govuk-character-count .govuk-textarea'
      )
      expect($component).not.toHaveAttribute('spellcheck')
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      document.body.innerHTML = render('character-count', examples['with hint'])

      expect(document.querySelector('.govuk-hint').outerHTML).toMatchSnapshot()
    })

    it('associates the character count as "described by" the hint', () => {
      document.body.innerHTML = render('character-count', examples['with hint'])

      const $textarea = document.querySelector('.govuk-js-character-count')

      expect($textarea).toHaveAccessibleDescription(
        "You can enter up to 10 characters Don't include personal or financial" +
          ' information, eg your National Insurance number or credit card' +
          ' details.'
      )
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with default value exceeding limit']
      )

      expect(
        document.querySelector('.govuk-error-message').outerHTML
      ).toMatchSnapshot()
    })

    it('associates the character-count as "described by" the error message', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with default value exceeding limit']
      )

      const $component = document.querySelector('.govuk-js-character-count')

      expect($component).toHaveAccessibleDescription(
        'You can enter up to 10 characters Error: Please do not exceed the' +
          ' maximum allowed limit'
      )
    })

    it('adds the error class to the character-count', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with default value exceeding limit']
      )

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveClass('govuk-textarea--error')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['custom classes with error message']
      )

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveClass('app-character-count--custom-modifier')
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with default value exceeding limit']
      )

      const $component = document.querySelector(
        '.govuk-form-group > .govuk-js-character-count'
      )
      expect($component).toBeInTheDocument()
    })

    it('renders with label', () => {
      document.body.innerHTML = render('character-count', examples.default)

      expect(document.querySelector('.govuk-label').outerHTML).toMatchSnapshot()
    })

    it('renders label with "for" attribute referring the character count "id"', () => {
      document.body.innerHTML = render('character-count', examples.default)

      const $component = document.querySelector('.govuk-js-character-count')
      expect($component).toHaveAccessibleName('Can you provide more detail?')
    })
  })

  describe('with threshold', () => {
    it('configures the threshold as data attribute', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with threshold']
      )

      const $component = document.querySelector('.govuk-character-count')
      expect($component).toHaveAttribute('data-threshold', '75')
    })
  })

  describe('with custom textarea description', () => {
    it('allows customisation of the textarea description', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with custom textarea description']
      )

      const message = document.querySelector('.govuk-character-count__message')
      expect(message).toHaveTextContent('Gallwch ddefnyddio hyd at 10 nod')
    })
  })

  describe('translations', () => {
    it('renders with translation data attributes', () => {
      document.body.innerHTML = render(
        'character-count',
        examples['with translations']
      )

      const $component = document.querySelector('[data-module]')

      Object.entries({
        'data-i18n.characters-under-limit.one': 'One character to go',
        'data-i18n.characters-under-limit.other': '%{count} characters to go',
        'data-i18n.characters-at-limit': 'Zero characters left',
        'data-i18n.characters-over-limit.one': 'One character too many',
        'data-i18n.characters-over-limit.other': '%{count} characters too many',
        'data-i18n.words-under-limit.one': 'One word to go',
        'data-i18n.words-under-limit.other': '%{count} words to go',
        'data-i18n.words-at-limit': 'Zero words left',
        'data-i18n.words-over-limit.one': 'One word too many',
        'data-i18n.words-over-limit.other': '%{count} words too many'
      }).forEach(([attributeName, expectedValue]) => {
        expect($component).toHaveAttribute(attributeName, expectedValue)
      })
    })
  })

  describe('when neither maxlength nor maxwords are set', () => {
    describe('with textarea description set', () => {
      // If the template has no maxwords or maxlength to go for it needs to pass
      // down any textarea description to the JavaScript so it can inject the
      // limit it may have received at instantiation
      it('renders the textarea description as a data attribute', () => {
        document.body.innerHTML = render(
          'character-count',
          examples['when neither maxlength nor maxwords are set']
        )

        // Fallback hint is passed as data attribute
        const $component = document.querySelector('[data-module]')
        expect($component).toHaveAttribute(
          'data-i18n.textarea-description.other',
          'No more than %{count} characters'
        )

        // No content is set as the accessible description cannot be
        // interpolated on the backend – it'll be up to the JavaScript to fill
        // it in
        const $countMessage = document.querySelector(
          '.govuk-character-count__message'
        )
        expect($countMessage).toHaveTextContent('')
      })
    })

    describe('without textarea description', () => {
      it('does not render a textarea description data attribute', () => {
        document.body.innerHTML = render(
          'character-count',
          examples[
            'when neither maxlength/maxwords nor textarea description are set'
          ]
        )

        const $component = document.querySelector('[data-module]')
        expect($component).not.toHaveAttribute(
          'data-i18n.textarea-description.other'
        )
      })
    })
  })
})
