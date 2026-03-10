const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Inset text', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('inset-text')
  })

  describe('by default', () => {
    it('renders with classes', () => {
      document.body.innerHTML = render('inset-text', examples.classes)

      const $component = document.querySelector('.govuk-inset-text')
      expect($component).toHaveClass('app-inset-text--custom-modifier')
    })

    it('renders with id', () => {
      document.body.innerHTML = render('inset-text', examples.id)

      const $component = document.querySelector('.govuk-inset-text')
      expect($component.id).toBe('my-inset-text')
    })

    it('renders nested components using `call`', () => {
      document.body.innerHTML = render('inset-text', {
        callBlock: '<div class="app-nested-component"></div>'
      })

      expect(
        document.querySelector('.govuk-inset-text .app-nested-component')
      ).toBeInTheDocument()
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      document.body.innerHTML = render('inset-text', examples['html as text'])

      const $component = document.querySelector('.govuk-inset-text')
      expect($component).toHaveTextContent(
        'It can take <b>up to 8 weeks</b> to register a lasting power of ' +
          'attorney if there are no mistakes in the application.'
      )
    })

    it('allows HTML to be passed un-escaped', () => {
      document.body.innerHTML = render('inset-text', examples['with html'])

      const mainContent = document.querySelector(
        '.govuk-inset-text .govuk-body:first-child'
      )

      const warningContent = document.querySelector(
        '.govuk-inset-text .govuk-warning-text__text'
      )

      expect(mainContent).toHaveTextContent(
        'It can take up to 8 weeks to register a lasting power of attorney if ' +
          'there are no mistakes in the application.'
      )

      expect(warningContent).toHaveTextContent(
        'Warning You can be fined up to £5,000 if you don’t register.'
      )
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('inset-text', examples.attributes)

      const $component = document.querySelector('.govuk-inset-text')
      expect($component).toHaveAttribute('data-attribute', 'my data value')
    })
  })
})
