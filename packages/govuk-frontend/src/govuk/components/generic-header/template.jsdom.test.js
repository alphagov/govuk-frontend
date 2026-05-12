const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('header')
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      document.body.innerHTML = render('header', examples.attributes)

      const $component = document.querySelector('.govuk-header')
      expect($component).toHaveAttribute('data-test-attribute', 'value')
      expect($component).toHaveAttribute('data-test-attribute-2', 'value-2')
    })

    it('renders classes', () => {
      document.body.innerHTML = render('header', examples.classes)

      const $component = document.querySelector('.govuk-header')
      expect($component).toHaveClass('app-header--custom-modifier')
    })

    it('renders custom container classes', () => {
      document.body.innerHTML = render('header', examples['full width'])

      const $container = document.querySelector('.govuk-header__container')

      expect($container).toHaveClass('govuk-header__container--full-width')
    })

    it('renders home page URL', () => {
      document.body.innerHTML = render(
        'header',
        examples['custom homepage url']
      )

      const $homepageLink = document.querySelector(
        '.govuk-header__homepage-link'
      )
      expect($homepageLink).toHaveAttribute('href', '/')
    })
  })

  describe('with product name', () => {
    it('renders product name', () => {
      document.body.innerHTML = render('header', examples['with product name'])

      const $productName = document.querySelector('.govuk-header__product-name')
      expect($productName).toHaveTextContent('Product Name')
    })
  })
})
