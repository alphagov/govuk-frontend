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

      const $component = $('.govuk-basic-header')
      expect($component.attr('data-test-attribute')).toBe('value')
      expect($component.attr('data-test-attribute-2')).toBe('value-2')
    })

    it('renders classes', () => {
      const $ = render('header', examples.classes)

      const $component = $('.govuk-basic-header')
      expect($component.hasClass('app-header--custom-modifier')).toBeTruthy()
    })

    it('renders custom container classes', () => {
      const $ = render('header', examples['full width'])

      const $component = $('.govuk-basic-header')
      const $container = $component.find('.govuk-basic-header__container')

      expect(
        $container.hasClass('govuk-basic-header__container--full-width')
      ).toBeTruthy()
    })

    it('renders home page URL', () => {
      const $ = render('header', examples['custom homepage url'])

      const $component = $('.govuk-basic-header')
      const $homepageLink = $component.find(
        '.govuk-basic-header__homepage-link'
      )
      expect($homepageLink.attr('href')).toBe('/')
    })
  })

  describe('with product name', () => {
    it('renders product name', () => {
      const $ = render('header', examples['with product name'])

      const $component = $('.govuk-basic-header')
      const $productName = $component.find('.govuk-basic-header__product-name')
      expect($productName.text().trim()).toBe('Product Name')
    })
  })

  describe('rebrand', () => {
    describe('when local `rebrand` parameter is enabled', () => {
      it('renders the new GOV.UK logotype', () => {
        const $ = render('header', examples.rebrand)

        expect($('.govuk-logo-dot')).not.toBeNull()
      })
    })

    describe('when `govukRebrand` nunjucks global is set to `true`', () => {
      it('renders the new GOV.UK logotype', () => {
        const env = nunjucksEnv()
        env.addGlobal('govukRebrand', true)

        const $ = render('header', {
          ...examples.default,
          env
        })

        expect($('.govuk-logo-dot')).not.toBeNull()
      })
    })
  })
})
