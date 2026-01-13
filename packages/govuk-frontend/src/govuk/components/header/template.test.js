const { render } = require('@govuk-frontend/helpers/nunjucks')
const { nunjucksEnv, getExamples } = require('@govuk-frontend/lib/components')

describe('header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('header')
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      const $ = render('header', examples.attributes)

      const $component = $('.govuk-header')
      expect($component.attr('data-test-attribute')).toBe('value')
      expect($component.attr('data-test-attribute-2')).toBe('value-2')
    })

    it('renders classes', () => {
      const $ = render('header', examples.classes)

      const $component = $('.govuk-header')
      expect($component.hasClass('app-header--custom-modifier')).toBeTruthy()
    })

    it('renders custom container classes', () => {
      const $ = render('header', examples['full width'])

      const $component = $('.govuk-header')
      const $container = $component.find('.govuk-header__container')

      expect(
        $container.hasClass('govuk-header__container--full-width')
      ).toBeTruthy()
    })

    it('renders home page URL', () => {
      const $ = render('header', examples['custom homepage url'])

      const $component = $('.govuk-header')
      const $homepageLink = $component.find('.govuk-header__homepage-link')
      expect($homepageLink.attr('href')).toBe('/')
    })
  })

  describe('with product name', () => {
    it('renders product name', () => {
      const $ = render('header', examples['with product name'])

      const $component = $('.govuk-header')
      const $productName = $component.find('.govuk-header__product-name')
      expect($productName.text().trim()).toBe('Product Name')
    })
  })

  describe('unbranded', () => {
    describe('when local `unbranded` parameter is enabled', () => {
      it('does not render the GOV.UK logotype', () => {
        const $ = render('header', examples.unbranded)

        expect($('.govuk-header__logotype')).toHaveLength(0)
      })
    })

    describe('when `govukUnbranded` nunjucks global is set to `true`', () => {
      it('does not render the GOV.UK logotype', () => {
        const env = nunjucksEnv()
        env.addGlobal('govukUnbranded', true)

        const $ = render('header', {
          ...examples.default,
          env
        })

        expect($('.govuk-header__logotype')).toHaveLength(0)
      })
    })
  })
})
