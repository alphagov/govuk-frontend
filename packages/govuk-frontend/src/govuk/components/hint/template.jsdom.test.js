const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Hint', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('hint')
  })

  describe('by default', () => {
    it('renders with text', () => {
      document.body.innerHTML = render('hint', examples.default)

      const $component = document.querySelector('.govuk-hint')
      expect($component).toHaveTextContent(
        "It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
      )
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('hint', examples.classes)

      const $component = document.querySelector('.govuk-hint')
      expect($component).toHaveClass('app-hint--custom-modifier')
    })

    it('renders with id', () => {
      document.body.innerHTML = render('hint', examples.id)

      const $component = document.querySelector('.govuk-hint')
      expect($component).toHaveAttribute('id', 'my-hint')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      document.body.innerHTML = render('hint', examples['html as text'])

      const $component = document.querySelector('.govuk-hint')
      expect($component).toHaveTextContent(
        'Unexpected <strong>bold text</strong> in body'
      )
    })

    it('allows HTML to be passed un-escaped', () => {
      document.body.innerHTML = render('hint', examples['with html'])

      const $component = document.querySelector('.govuk-hint')
      expect($component).toContainHTML(
        'It\'s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.\nFor example, \'QQ 12 34 56 C\'.'
      )
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('hint', examples.attributes)

      const $component = document.querySelector('.govuk-hint')
      expect($component).toHaveAttribute('data-attribute', 'my data value')
    })
  })
})
