const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('back-link component', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('back-link')
  })

  describe('by default', () => {
    let $component

    beforeAll(() => {
      document.body.innerHTML = render('back-link', examples.default)
      $component = document.querySelector('.govuk-back-link')
    })

    it('outputs a link', () => {
      expect($component.tagName).toBe('A')
    })

    it('has an href of "#"', () => {
      expect($component).toHaveAttribute('href', '#')
    })

    it('includes the text "Back"', () => {
      expect($component).toHaveTextContent('Back')
    })
  })

  it('includes additional classes from the `classes` option', () => {
    document.body.innerHTML = render('back-link', examples.classes)

    const $component = document.querySelector('.govuk-back-link')
    expect($component).toHaveClass('app-back-link--custom-class')
  })

  it('allows the link to be customised using the `href` option', () => {
    document.body.innerHTML = render('back-link', examples['with custom link'])

    const $component = document.querySelector('.govuk-back-link')
    expect($component).toHaveAttribute('href', '/home')
  })

  it('allows the text to be customised using the `text` option', () => {
    document.body.innerHTML = render('back-link', examples['with custom text'])

    const $component = document.querySelector('.govuk-back-link')
    expect($component).toHaveTextContent('Back to home')
  })

  it('escapes HTML when using the `text` option', () => {
    document.body.innerHTML = render('back-link', examples['html as text'])

    const $component = document.querySelector('.govuk-back-link')
    expect($component).toHaveTextContent('<b>Home</b>')
  })

  it('does not escape HTML when using the `html` option', () => {
    document.body.innerHTML = render('back-link', examples.html)

    const $component = document.querySelector('.govuk-back-link')
    expect($component).toContainHTML('<b>Back</b>')
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('back-link', examples.attributes)

    const $component = document.querySelector('.govuk-back-link')

    expect($component).toHaveAttribute('data-test', 'attribute')
    expect($component).toHaveAttribute('aria-label', 'Back to home')
  })
})
