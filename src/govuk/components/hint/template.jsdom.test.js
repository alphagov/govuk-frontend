const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Hint', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('hint')
  })

  it('contains the hint text', () => {
    document.body.innerHTML = render('hint', examples.default)

    const $component = document.querySelector('.govuk-hint')
    expect($component).toHaveTextContent(
      "It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
    )
  })

  it('includes additional classes from the `classes` option', () => {
    document.body.innerHTML = render('hint', examples.classes)

    const $component = document.querySelector('.govuk-hint')
    expect($component).toHaveClass('app-hint--custom-modifier')
  })

  it('does not include an `id` attribute if the `id` option is not set', () => {
    document.body.innerHTML = render('hint', examples.default)

    const $component = document.querySelector('.govuk-hint')
    expect($component).not.toHaveAttribute('id')
  })

  it('sets the `id` attribute based on the `id` option', () => {
    document.body.innerHTML = render('hint', examples.id)

    const $component = document.querySelector('.govuk-hint')
    expect($component).toHaveAttribute('id', 'my-hint')
  })

  it('escapes HTML when using the `text` option', () => {
    document.body.innerHTML = render('hint', examples['html as text'])

    const $component = document.querySelector('.govuk-hint')
    expect($component).toHaveTextContent(
      'Unexpected <strong>bold text</strong> in body'
    )
  })

  it('does not escape HTML when using the `html` option', () => {
    document.body.innerHTML = render('hint', examples['with html'])

    const $component = document.querySelector('.govuk-hint')
    expect($component).toContainHTML(
      'It\'s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.\n  For example, \'QQ 12 34 56 C\'.'
    )
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('hint', examples.attributes)

    const $component = document.querySelector('.govuk-hint')
    expect($component).toHaveAttribute('data-attribute', 'my data value')
  })
})
