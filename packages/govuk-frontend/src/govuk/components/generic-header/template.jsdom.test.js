const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('generic header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('generic-header')
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      document.body.innerHTML = render('generic-header', examples.attributes)

      const $component = document.querySelector('.govuk-generic-header')
      expect($component).toHaveAttribute('data-test-attribute', 'value')
      expect($component).toHaveAttribute('data-test-attribute-2', 'value-2')
    })

    it('renders classes', () => {
      document.body.innerHTML = render('generic-header', examples.classes)

      const $component = document.querySelector('.govuk-generic-header')
      expect($component).toHaveClass('app-header--custom-modifier')
    })

    it('renders custom container classes', () => {
      document.body.innerHTML = render('generic-header', examples['full width'])

      const $container = document.querySelector(
        '.govuk-generic-header__container'
      )

      expect($container).toHaveClass(
        'govuk-generic-header__container--full-width'
      )
    })

    it('renders URL', () => {
      document.body.innerHTML = render('generic-header', examples['custom url'])

      const $homepageLink = document.querySelector(
        '.govuk-generic-header__homepage-link'
      )
      expect($homepageLink).toHaveAttribute('href', 'https://www.pizza.gov.uk')
    })
  })

  describe('with logo', () => {
    it('renders text logo content', () => {
      document.body.innerHTML = render('generic-header', examples.default)

      const $logoLink = document.querySelector(
        '.govuk-generic-header__homepage-link'
      )

      expect($logoLink).toHaveTextContent('My cool service')
    })

    it('renders text logo content', () => {
      document.body.innerHTML = render(
        'generic-header',
        examples['with image logo']
      )

      const $logoSvg = document.querySelector(
        '.govuk-generic-header__homepage-link svg'
      )

      expect($logoSvg).toBeTruthy()
    })
  })
})
