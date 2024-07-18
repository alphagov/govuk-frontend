const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Warning text', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('warning-text')
  })

  describe('default example', () => {
    beforeAll(() => {
      document.body.innerHTML = render('warning-text', examples.default)
    })

    it('contains the text from the `text` option', () => {
      const $component = document.querySelector('.govuk-warning-text')

      expect($component).toHaveTextContent(
        'You can be fined up to £5,000 if you don’t register.'
      )
    })

    it('includes the default assistive text', () => {
      const $assistiveText = document.querySelector('.govuk-visually-hidden')

      expect($assistiveText).toHaveTextContent('Warning')
    })

    it('hides the icon from screen readers using the `aria-hidden` attribute', () => {
      const $icon = document.querySelector('.govuk-warning-text__icon')

      expect($icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('includes additional classes from the `classes` option', () => {
    document.body.innerHTML = render('warning-text', examples.classes)
    const $component = document.querySelector('.govuk-warning-text')

    expect($component).toHaveClass('govuk-warning-text--custom-class')
  })

  it('includes custom assistive text based on the `iconFallbackText` option', () => {
    document.body.innerHTML = render(
      'warning-text',
      examples['icon fallback text only']
    )
    const $assistiveText = document.querySelector('.govuk-visually-hidden')

    expect($assistiveText).toHaveTextContent('Some custom fallback text')
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('warning-text', examples.attributes)
    const $component = document.querySelector('.govuk-warning-text')

    expect($component).toHaveAttribute('data-test', 'attribute')
    expect($component).toHaveAttribute('id', 'my-warning-text')
  })

  it('escapes HTML when using the `text` option', () => {
    document.body.innerHTML = render('warning-text', examples['html as text'])
    const $component = document.querySelector('.govuk-warning-text')

    expect($component).toHaveTextContent(
      '<span>Some custom warning text</span>'
    )
  })

  it('does not escape HTML when using the `html` option', () => {
    document.body.innerHTML = render('warning-text', examples.html)
    const $component = document.querySelector('.govuk-warning-text')

    expect($component).toContainHTML('<span>Some custom warning text</span>')
  })
})
