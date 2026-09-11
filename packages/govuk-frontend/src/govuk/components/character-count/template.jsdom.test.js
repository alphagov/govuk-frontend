const { getExamples, render } = require('@govuk-frontend/lib/components')

const { CharacterCount } = require('./character-count.mjs')

describe('Character count', () => {
  /** @type {Awaited<ReturnType<typeof getExamples>>} */
  let examples

  /** @type {HTMLElement} */
  let $root

  /** @type {HTMLElement} */
  let $textarea

  /** @type {HTMLElement} */
  let $textareaDescription

  /**
   * @param {keyof typeof examples} example
   */
  function initExample(example) {
    document.body.innerHTML = render('character-count', examples[example])

    $root = /** @type {HTMLElement} */ (
      document.querySelector(`[data-module="${CharacterCount.moduleName}"]`)
    )

    $textarea = $root.querySelector('textarea.govuk-textarea')
    $textareaDescription = $root.querySelector(
      'div.govuk-character-count__message'
    )
  }

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  describe('default example', () => {
    beforeEach(() => {
      initExample('default')
    })

    it('autopopulates default id from name', () => {
      expect($textarea).toHaveAttribute('id', $textarea.getAttribute('name'))
    })

    it('renders with name', () => {
      expect($textarea).toHaveAttribute('name', 'more-detail')
    })

    it('renders with default number of rows', () => {
      expect($textarea).toHaveAttribute('rows', '5')
    })
  })

  describe('custom options', () => {
    it('renders with id', () => {
      initExample('id')

      expect($textarea).toHaveAttribute('id', 'character-count-id')
    })

    it('renders with classes', () => {
      initExample('classes')

      expect($textarea).toHaveClass('app-character-count--custom-modifier')
    })

    it('renders with rows', () => {
      initExample('with custom rows')

      expect($textarea).toHaveAttribute('rows', '8')
    })

    it('renders with value', () => {
      initExample('with default value')

      expect($textarea).toHaveValue('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      initExample('attributes')

      expect($textarea).toHaveAttribute('data-attribute', 'my data value')
    })

    it('renders with formGroup', () => {
      initExample('formGroup with classes')

      const $formGroup = document.querySelector('.govuk-form-group')
      expect($formGroup).toHaveClass('app-character-count--custom-modifier')
    })
  })

  describe('count message', () => {
    it('renders with the amount of characters expected', () => {
      initExample('default')

      expect($textareaDescription).toHaveTextContent(
        'You can enter up to 10 characters'
      )
    })

    it('renders with the amount of words expected', () => {
      initExample('with word count')

      expect($textareaDescription).toHaveTextContent(
        'You can enter up to 10 words'
      )
    })

    it('is associated with the textarea', () => {
      initExample('default')

      expect($textarea).toHaveAccessibleDescription(
        'You can enter up to 10 characters'
      )
    })

    it('renders with custom classes', () => {
      initExample('custom classes on countMessage')

      expect($textareaDescription).toHaveClass('app-custom-count-message')
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders the textarea with spellcheck attribute set to true', () => {
      initExample('spellcheck enabled')

      expect($textarea).toHaveAttribute('spellcheck', 'true')
    })

    it('renders the textarea with spellcheck attribute set to false', () => {
      initExample('spellcheck disabled')

      expect($textarea).toHaveAttribute('spellcheck', 'false')
    })

    it('renders the textarea without spellcheck attribute by default', () => {
      initExample('default')

      expect($textarea).not.toHaveAttribute('spellcheck')
    })
  })

  describe('when it includes a hint', () => {
    beforeEach(() => {
      initExample('with hint')
    })

    it('renders with hint', () => {
      const $hint = document.querySelector('.govuk-hint')
      expect($hint.outerHTML).toMatchSnapshot()
    })

    it('associates the character count as "described by" the hint', () => {
      expect($textarea).toHaveAccessibleDescription(
        "You can enter up to 10 characters Don't include personal or financial" +
          ' information, eg your National Insurance number or credit card' +
          ' details.'
      )
    })
  })

  describe('when it includes an error message', () => {
    beforeEach(() => {
      initExample('with default value exceeding limit')
    })

    it('renders with error message', () => {
      const $errorMessage = document.querySelector('.govuk-error-message')
      expect($errorMessage.outerHTML).toMatchSnapshot()
    })

    it('associates the character-count as "described by" the error message', () => {
      expect($textarea).toHaveAccessibleDescription(
        'You can enter up to 10 characters Error: Please do not exceed the' +
          ' maximum allowed limit'
      )
    })

    it('adds the error class to the character-count', () => {
      expect($textarea).toHaveClass('govuk-textarea--error')
    })

    it('renders with classes', () => {
      initExample('custom classes with error message')

      expect($textarea).toHaveClass('app-character-count--custom-modifier')
    })
  })

  describe('with dependant components', () => {
    beforeEach(() => {
      initExample('default')
    })

    it('have correct nesting order', () => {
      const $formGroup = document.querySelector('.govuk-form-group')
      expect($textarea.parentElement).toEqual($formGroup)
    })

    it('renders with label', () => {
      const $label = document.querySelector('.govuk-label')
      expect($label.outerHTML).toMatchSnapshot()
    })

    it('renders label with "for" attribute referring the character count "id"', () => {
      expect($textarea).toHaveAccessibleName('Can you provide more detail?')
    })
  })

  describe('with threshold', () => {
    beforeEach(() => {
      initExample('with threshold')
    })

    it('configures the threshold as data attribute', () => {
      expect($root).toHaveAttribute('data-threshold', '75')
    })
  })

  describe('with custom textarea description', () => {
    beforeEach(() => {
      initExample('with custom textarea description')
    })

    it('allows customisation of the textarea description', () => {
      expect($textareaDescription).toHaveTextContent(
        'Gallwch ddefnyddio hyd at 10 nod'
      )
    })
  })

  describe('translations', () => {
    beforeEach(() => {
      initExample('with translations')
    })

    it('renders with translation data attributes', () => {
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
        expect($root).toHaveAttribute(attributeName, expectedValue)
      })
    })
  })

  describe('when neither maxlength nor maxwords are set', () => {
    beforeEach(() => {
      initExample('when neither maxlength nor maxwords are set')
    })

    describe('with textarea description set', () => {
      // If the template has no maxwords or maxlength to go for it needs to pass
      // down any textarea description to the JavaScript so it can inject the
      // limit it may have received at instantiation
      it('renders the textarea description as a data attribute', () => {
        // Fallback hint is passed as data attribute
        expect($root).toHaveAttribute(
          'data-i18n.textarea-description.other',
          'No more than %{count} characters'
        )

        // No content is set as the accessible description cannot be
        // interpolated on the backend – it'll be up to the JavaScript to fill
        // it in
        expect($textareaDescription).toHaveTextContent('')
      })
    })

    describe('without textarea description', () => {
      beforeEach(() => {
        initExample(
          'when neither maxlength/maxwords nor textarea description are set'
        )
      })

      it('does not render a textarea description data attribute', () => {
        expect($root).not.toHaveAttribute(
          'data-i18n.textarea-description.other'
        )
      })
    })
  })
})
