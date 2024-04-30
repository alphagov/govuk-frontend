const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Service Header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('service-header')
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      const $ = render('service-header', examples.attributes)
      const $component = $('.govuk-service-header')

      expect($component.attr('data-foo')).toBe('bar')
      expect($component.attr('data-pika')).toBe('chu')
    })

    it('renders classes correctly', () => {
      const $ = render('service-header', examples.classes)
      const $component = $('.govuk-service-header')

      expect($component.hasClass('app-my-curious-custom-class')).toBeTruthy()
    })
  })

  describe('with no options set', () => {
    it("doesn't output anything", () => {
      const $ = render('service-header', examples['with no options set'])
      const $component = $('.govuk-service-header')

      expect($component).toHaveLength(0)
    })
  })

  describe('with service name', () => {
    it('renders the service name', () => {
      const $ = render('service-header', examples.default)
      const $component = $('.govuk-service-header')

      const $serviceName = $component.find(
        '.govuk-service-header__service-name'
      )

      expect($serviceName.get(0).tagName).toBe('span')
      expect($serviceName.text().trim()).toBe('Service name')
    })

    it('wraps the service name with a link when a url is provided', () => {
      const $ = render('service-header', examples['with service link'])
      const $component = $('.govuk-service-header')

      const $serviceName = $component.find(
        '.govuk-service-header__service-name'
      )
      const $serviceLink = $serviceName.find(
        '.govuk-service-header__link--service-name'
      )

      expect($serviceLink).toHaveLength(1)
      expect($serviceLink.get(0).tagName).toBe('a')
      expect($serviceLink.attr('href')).toBe('#/')
    })

    it('does not use a link when no service url is provided', () => {
      const $ = render('service-header', examples.default)
      const $component = $('.govuk-service-header')

      const $serviceName = $component.find(
        '.govuk-service-header__service-name'
      )
      const $serviceLink = $serviceName.find(
        '.govuk-service-header__link--service-name'
      )

      expect($serviceLink).toHaveLength(0)
    })
  })

  describe('with navigation', () => {
    it('renders navigation', () => {
      const $ = render('service-header', examples['with navigation'])
      const $component = $('.govuk-service-header')

      const $nav = $component.find('nav.govuk-service-header__navigation')
      const $list = $nav.find('ul.govuk-service-header__navigation-list')
      const $items = $list.find('li.govuk-service-header__navigation-item')
      const $firstItem = $items.find('a.govuk-service-header__link:first-child')

      expect($nav).toBeDefined()
      expect($list).toBeDefined()
      expect($items).toHaveLength(4)
      expect($firstItem.attr('href')).toBe('#/1')
      expect($firstItem.text()).toContain('Navigation item 1')
    })

    it('renders navigation items containing HTML', () => {
      const $ = render('service-header', examples['with HTML navigation items'])

      const $list = $('ul.govuk-service-header__navigation-list')
      const $items = $list.find('li.govuk-service-header__navigation-item')
      const $firstItem = $items.find('a.govuk-service-header__link:first-child')

      expect($firstItem.html().trim()).toBe('<em>Navigation item 1</em>')
    })

    it('renders default navigation label', () => {
      const $ = render('service-header', examples['with navigation'])
      const $component = $('.govuk-service-header')

      const $nav = $component.find('nav.govuk-service-header__navigation')

      expect($nav.attr('aria-label')).toBe('Menu')
    })

    it('renders custom navigation label', () => {
      const $ = render(
        'service-header',
        examples['with custom navigation label']
      )
      const $component = $('.govuk-service-header')

      const $nav = $component.find('nav.govuk-service-header__navigation')

      expect($nav.attr('aria-label')).toBe('Main navigation')
    })

    it('renders custom navigation classes', () => {
      const $ = render(
        'service-header',
        examples['with custom navigation classes']
      )
      const $component = $('.govuk-service-header')

      const $nav = $component.find('nav.govuk-service-header__navigation')

      expect($nav.hasClass('app-my-neat-navigation-class')).toBeTruthy()
    })

    it('renders the default navigation ID', () => {
      const $ = render('service-header', examples['with navigation'])
      const $component = $('.govuk-service-header')

      const $nav = $component.find('.govuk-service-header__navigation')
      const $navToggle = $component.find('.govuk-service-header__toggle')

      const navId = $nav.attr('id')

      expect(navId).toBe('navigation')
      expect($navToggle.attr('aria-controls')).toBe(navId)
    })

    it('renders custom navigation ID', () => {
      const $ = render('service-header', examples['with custom navigation ID'])
      const $component = $('.govuk-service-header')

      const $nav = $component.find('.govuk-service-header__navigation')
      const $navToggle = $component.find('.govuk-service-header__toggle')

      const navId = $nav.attr('id')

      expect(navId).toBe('main-nav')
      expect($navToggle.attr('aria-controls')).toBe(navId)
    })

    describe('toggle button', () => {
      it('renders the navigation toggle button', () => {
        const $ = render('service-header', examples['with navigation'])
        const $component = $('.govuk-service-header')

        const $navToggle = $component.find('.govuk-service-header__toggle')

        expect($navToggle).toHaveLength(1)
        expect($navToggle.get(0).tagName).toBe('button')
        expect($navToggle.attr('type')).toBe('button')
      })

      it('renders the navigation toggle button hidden by default', () => {
        const $ = render('service-header', examples['with navigation'])
        const $component = $('.govuk-service-header')

        const $navToggle = $component.find('.govuk-service-header__toggle')

        expect($navToggle.attr('hidden')).toBeDefined()
      })

      describe('toggle label', () => {
        it("doesn't render the label by default", () => {
          const $ = render('service-header', examples['with navigation'])
          const $component = $('.govuk-service-header')

          const $navToggle = $component.find('.govuk-service-header__toggle')

          expect($navToggle.attr('aria-label')).toBeUndefined()
        })

        it('does not render the label if the specified label is the same as the text', () => {
          const $ = render(
            'service-header',
            examples['with identical navigation toggle text and label']
          )
          const $component = $('.govuk-service-header')

          const $navToggle = $component.find('.govuk-service-header__toggle')

          expect($navToggle.text().trim()).toBe('Enter the NavZone')
          expect($navToggle.attr('aria-label')).toBeUndefined()
        })

        it('renders custom label', () => {
          const $ = render(
            'service-header',
            examples['with custom navigation toggle label']
          )
          const $component = $('.govuk-service-header')

          const $navToggle = $component.find('.govuk-service-header__toggle')

          expect($navToggle.attr('aria-label')).toBe('Enter the NavZone')
        })
      })

      describe('toggle text', () => {
        it('renders default text', () => {
          const $ = render('service-header', examples['with navigation'])
          const $component = $('.govuk-service-header')

          const $navToggle = $component.find('.govuk-service-header__toggle')

          expect($navToggle.text().trim()).toBe('Menu')
        })

        it('renders custom text', () => {
          const $ = render(
            'service-header',
            examples['with custom navigation toggle text']
          )
          const $component = $('.govuk-service-header')

          const $navToggle = $component.find('.govuk-service-header__toggle')

          expect($navToggle.text().trim()).toBe('Enter the NavZone')
        })

        it('bubbles custom text to the navigation label', () => {
          const $ = render(
            'service-header',
            examples['with custom navigation toggle text']
          )
          const $component = $('.govuk-service-header')

          const $nav = $component.find('nav.govuk-service-header__navigation')
          const $navToggle = $component.find('.govuk-service-header__toggle')

          const navLabel = $nav.attr('aria-label')
          const navToggleText = $navToggle.text().trim()

          expect(navToggleText).toBe('Enter the NavZone')
          expect(navLabel).toBe(navToggleText)
        })

        it("does not bubble custom text to the navigation label if it's been customised", () => {
          const $ = render(
            'service-header',
            examples['with custom navigation toggle text and navigation label']
          )
          const $component = $('.govuk-service-header')

          const $nav = $component.find('nav.govuk-service-header__navigation')
          const $navToggle = $component.find('.govuk-service-header__toggle')

          const navLabel = $nav.attr('aria-label')
          const navToggleText = $navToggle.text().trim()

          expect(navLabel).toBe('The NavZone')
          expect(navToggleText).toBe('Enter the NavZone')
        })
      })
    })

    describe('non-linked navigation items', () => {
      it('renders text passed without a link', () => {
        const $ = render(
          'service-header',
          examples['with non-link navigation items']
        )

        const $navItem = $('.govuk-service-header__navigation-item:first-child')
        const $navLink = $navItem.find('a')
        const $navText = $navItem.find('.govuk-service-header__navigation-text')

        expect($navLink).toHaveLength(0)
        expect($navText).toHaveLength(1)
        expect($navText.text().trim()).toBe('Navigation item 1')
      })

      it('renders HTML passed without a link', () => {
        const $ = render(
          'service-header',
          examples['with non-link navigation items']
        )

        const $navItem = $(
          '.govuk-service-header__navigation-item:nth-child(2)'
        )
        const $navLink = $navItem.find('a')
        const $navText = $navItem.find('.govuk-service-header__navigation-text')

        expect($navLink).toHaveLength(0)
        expect($navText).toHaveLength(1)
        expect($navText.html().trim()).toBe('<em>Navigation item 2</em>')
      })
    })

    describe('active and current items', () => {
      it('renders navigation with an active item', () => {
        const $ = render(
          'service-header',
          examples['with navigation with an active item']
        )

        const $activeItem = $(
          'li.govuk-service-header__navigation-item:nth-child(2)'
        )
        const $activeLink = $activeItem.find('a')
        const $activeFallback = $activeItem.find('strong')

        expect(
          $activeItem.hasClass('govuk-service-header__navigation-item--active')
        ).toBeTruthy()
        expect($activeLink.attr('aria-current')).toBe('true')
        expect($activeFallback).toHaveLength(1)
      })

      it('renders navigation with a current item', () => {
        const $ = render(
          'service-header',
          examples['with navigation with a current item']
        )

        const $activeItem = $(
          'li.govuk-service-header__navigation-item:nth-child(2)'
        )
        const $activeLink = $activeItem.find('a')
        const $activeFallback = $activeItem.find('strong')

        expect(
          $activeItem.hasClass('govuk-service-header__navigation-item--active')
        ).toBeTruthy()
        expect($activeLink.attr('aria-current')).toBe('page')
        expect($activeFallback).toHaveLength(1)
      })
    })
  })

  describe('slots', () => {
    it('inserts HTML from the `start` slot in the right place', () => {
      const $ = render('service-header', examples['with slotted content'])

      // Expected to be first thing in the inner container
      const $slottedElement = $(
        '.govuk-service-header__container > :first-child'
      )

      expect($slottedElement.prop('outerHTML')).toBe('<div>[start]</div>')
    })

    it('inserts HTML from the `end` slot in the right place', () => {
      const $ = render('service-header', examples['with slotted content'])

      // Expected to be last thing in the inner container
      const $slottedElement = $(
        '.govuk-service-header__container > :last-child'
      )

      expect($slottedElement.prop('outerHTML')).toBe('<div>[end]</div>')
    })

    it('inserts HTML from the `navigationStart` slot in the right place', () => {
      const $ = render('service-header', examples['with slotted content'])

      // Expected to be first thing in the nav list
      const $slottedElement = $(
        '.govuk-service-header__navigation-list > :first-child'
      )

      expect($slottedElement.prop('outerHTML')).toBe(
        '<li>[navigation start]</li>'
      )
    })

    it('inserts HTML from the `navigationEnd` slot in the right place', () => {
      const $ = render('service-header', examples['with slotted content'])

      // Expected to be first thing in the nav list
      const $slottedElement = $(
        '.govuk-service-header__navigation-list > :last-child'
      )

      expect($slottedElement.prop('outerHTML')).toBe(
        '<li>[navigation end]</li>'
      )
    })
  })
})
