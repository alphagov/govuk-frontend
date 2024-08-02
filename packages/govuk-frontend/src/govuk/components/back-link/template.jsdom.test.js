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

  describe('the `href` option', () => {
    it('allows the link to be customised', () => {
      document.body.innerHTML = render(
        'back-link',
        examples['with custom link']
      )

      const $component = document.querySelector('.govuk-back-link')
      expect($component).toHaveAttribute('href', '/home')
    })

    it.each(['', 0, false, null, undefined])('uses `#` for `%s`', (href) => {
      document.body.innerHTML = render('back-link', { context: { href } })
      const $component = document.querySelector('.govuk-back-link')

      expect($component).toHaveAttribute('href', '#')
    })
  })

  describe('the `text` option', () => {
    it('allows the text to be customised', () => {
      document.body.innerHTML = render(
        'back-link',
        examples['with custom text']
      )

      const $component = document.querySelector('.govuk-back-link')
      expect($component).toHaveTextContent('Back to home')
    })

    it('escapes HTML', () => {
      document.body.innerHTML = render('back-link', examples['html as text'])

      const $component = document.querySelector('.govuk-back-link')
      expect($component).toHaveTextContent('<b>Home</b>')
    })

    it.each(['', 0, false, null, undefined])(
      'displays `Back` for `%s`',
      (text) => {
        document.body.innerHTML = render('back-link', { context: { text } })
        const $component = document.querySelector('.govuk-back-link')

        expect($component).toHaveTextContent('Back')
      }
    )
  })

  describe('the `html` option', () => {
    it('does not escape HTML', () => {
      document.body.innerHTML = render('back-link', examples.html)

      const $component = document.querySelector('.govuk-back-link')
      expect($component).toContainHTML('<b>Back</b>')
    })

    it.each(['', 0, false, null, undefined])(
      'displays `Back` for `%s`',
      (html) => {
        document.body.innerHTML = render('back-link', { context: { html } })
        const $component = document.querySelector('.govuk-back-link')

        expect($component).toHaveTextContent('Back')
      }
    )
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('back-link', examples.attributes)

    const $component = document.querySelector('.govuk-back-link')

    expect($component).toHaveAttribute('data-test', 'attribute')
    expect($component).toHaveAttribute('aria-label', 'Back to home')
  })
})
