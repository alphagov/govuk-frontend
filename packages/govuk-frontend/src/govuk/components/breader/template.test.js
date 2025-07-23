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

    it('renders custom navigation classes', () => {
      const $ = render('header', examples['full width with navigation'])

      const $component = $('.govuk-header')
      const $container = $component.find('.govuk-header__navigation')

      expect($container.hasClass('govuk-header__navigation--end')).toBeTruthy()
    })

    it('renders home page URL', () => {
      const $ = render('header', examples['custom homepage url'])

      const $component = $('.govuk-header')
      const $homepageLink = $component.find('.govuk-header__link--homepage')
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

  describe('with service name', () => {
    it('renders service name', () => {
      const $ = render('header', examples['with service name'])

      const $component = $('.govuk-header')
      const $serviceName = $component.find('.govuk-header__service-name')
      expect($serviceName.text().trim()).toBe('Service Name')
    })

    it('wraps the service name with a link when a url is provided', () => {
      const $ = render('header', examples['with service name'])

      const $component = $('.govuk-header')
      const $serviceName = $component.find('.govuk-header__service-name')
      expect($serviceName.get(0).tagName).toBe('a')
      expect($serviceName.attr('href')).toBe('/components/header')
    })

    it('does not use a link when no service url is provided', () => {
      const $ = render(
        'header',
        examples['with service name but no service url']
      )

      const $component = $('.govuk-header')
      const $serviceName = $component.find('.govuk-header__service-name')
      expect($serviceName.get(0).tagName).toBe('span')
      expect($serviceName.attr('href')).toBeUndefined()
    })
  })

  describe('with navigation', () => {
    it('renders navigation', () => {
      const $ = render('header', examples['with navigation'])

      const $component = $('.govuk-header')
      const $list = $component.find('ul.govuk-header__navigation-list')
      const $items = $list.find('li.govuk-header__navigation-item')
      const $firstItem = $items.find('a.govuk-header__link:first-child')
      expect($items).toHaveLength(4)
      expect($firstItem.attr('href')).toBe('#1')
      expect($firstItem.text()).toContain('Navigation item 1')
    })

    it('renders navigation default label correctly', () => {
      const $ = render('header', examples['with navigation'])

      const $component = $('.govuk-header')
      const $nav = $component.find('nav')

      expect($nav.attr('aria-label')).toBe('Menu')
    })

    it('renders navigation label correctly when custom menu button text is set', () => {
      const $ = render('header', examples['with custom menu button text'])

      const $component = $('.govuk-header')
      const $nav = $component.find('nav')

      expect($nav.attr('aria-label')).toBe('Dewislen')
    })

    it('allows navigation label to be customised', () => {
      const $ = render('header', examples['with custom navigation label'])

      const $component = $('.govuk-header')
      const $nav = $component.find('nav')

      expect($nav.attr('aria-label')).toBe('Custom navigation label')
    })

    it('renders navigation label and menu button text when these are both set', () => {
      const $ = render(
        'header',
        examples['with custom navigation label and custom menu button text']
      )

      const $component = $('.govuk-header')
      const $nav = $component.find('nav')
      const $button = $component.find('.govuk-header__menu-button')

      expect($nav.attr('aria-label')).toBe('Custom navigation label')
      expect($button.text().trim()).toBe('Custom menu button text')
    })

    it('renders navigation with active item', () => {
      const $ = render('header', examples['with navigation'])

      const $activeItem = $('li.govuk-header__navigation-item:first-child')
      expect(
        $activeItem.hasClass('govuk-header__navigation-item--active')
      ).toBeTruthy()
    })

    it('allows navigation item text to be passed whilst escaping HTML entities', () => {
      const $ = render('header', examples['navigation item with html as text'])

      const $navigationLink = $('.govuk-header__navigation-item a')
      expect($navigationLink.html()).toContain(
        '&lt;em&gt;Navigation item 1&lt;/em&gt;'
      )
    })

    it('allows navigation item HTML to be passed un-escaped', () => {
      const $ = render('header', examples['navigation item with html'])

      const $navigationLink = $('.govuk-header__navigation-item a')
      expect($navigationLink.html()).toContain('<em>Navigation item 1</em>')
    })

    it('renders navigation item with text without a link', () => {
      const $ = render(
        'header',
        examples['navigation item with text without link']
      )

      const $navigationItem = $('.govuk-header__navigation-item')
      expect($navigationItem.html().trim()).toBe('Navigation item 1')
    })

    it('renders navigation item with html without a link', () => {
      const $ = render(
        'header',
        examples['navigation item with html without link']
      )

      const $navigationItem = $('.govuk-header__navigation-item')
      expect($navigationItem.html()).toContain('<em>Navigation item 1</em>')
    })

    it('renders navigation item anchor with attributes', () => {
      const $ = render('header', examples['navigation item with attributes'])

      const $navigationLink = $('.govuk-header__navigation-item a')
      expect($navigationLink.attr('data-attribute')).toBe('my-attribute')
      expect($navigationLink.attr('data-attribute-2')).toBe('my-attribute-2')
    })

    describe('menu button', () => {
      it('has an explicit type="button" so it does not act as a submit button', () => {
        const $ = render('header', examples['with navigation'])

        const $button = $('.govuk-header__menu-button')

        expect($button.attr('type')).toBe('button')
      })
      it('has a hidden attribute on load so that it does not show an unusable button without js', () => {
        const $ = render('header', examples['with navigation'])

        const $button = $('.govuk-header__menu-button')

        expect($button.attr('hidden')).toBeTruthy()
      })
      it('allows label to be customised', () => {
        const $ = render('header', examples['with custom menu button label'])

        const $button = $('.govuk-header__menu-button')

        expect($button.attr('aria-label')).toBe('Custom button label')
      })
      it('renders default text correctly', () => {
        const $ = render('header', examples['with navigation'])

        const $button = $('.govuk-header__menu-button')

        expect($button.text().trim()).toBe('Menu')
      })
      it('allows text to be customised', () => {
        const $ = render('header', examples['with custom menu button text'])

        const $button = $('.govuk-header__menu-button')

        expect($button.text().trim()).toBe('Dewislen')
      })
    })
  })

  describe.each([
    { message: 'without navigation', exampleName: 'default' },
    { message: 'with empty navigation', exampleName: 'empty navigation array' }
  ])('$message', ({ exampleName }) => {
    let $

    beforeAll(() => {
      $ = render('summary-list', examples[exampleName])
    })

    it('does not include a menu button', async () => {
      expect($('.govuk-header__menu-button')).toHaveLength(0)
    })

    it('does not include a <nav> element', async () => {
      expect($('nav')).toHaveLength(0)
    })

    it('does not include a govuk-header__content wrapper', async () => {
      expect($('.govuk-header__content')).toHaveLength(0)
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
