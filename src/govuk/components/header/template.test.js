/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('header')

describe('header', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('header', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('has a role of `banner`', () => {
      const $ = render('header', examples.default)

      const $component = $('.moaland-header')
      expect($component.attr('role')).toEqual('banner')
    })
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      const $ = render('header', examples.attributes)

      const $component = $('.moaland-header')
      expect($component.attr('data-test-attribute')).toEqual('value')
      expect($component.attr('data-test-attribute-2')).toEqual('value-2')
    })

    it('renders classes', () => {
      const $ = render('header', examples.classes)

      const $component = $('.moaland-header')
      expect($component.hasClass('app-header--custom-modifier')).toBeTruthy()
    })

    it('renders custom container classes', () => {
      const $ = render('header', examples['full width'])

      const $component = $('.moaland-header')
      const $container = $component.find('.moaland-header__container')

      expect($container.hasClass('moaland-header__container--full-width')).toBeTruthy()
    })

    it('renders custom navigation classes', () => {
      const $ = render('header', examples['full width with navigation'])

      const $component = $('.moaland-header')
      const $container = $component.find('.moaland-header__navigation')

      expect($container.hasClass('moaland-header__navigation--end')).toBeTruthy()
    })

    it('renders home page URL', () => {
      const $ = render('header', examples['custom homepage url'])

      const $component = $('.moaland-header')
      const $homepageLink = $component.find('.moaland-header__link--homepage')
      expect($homepageLink.attr('href')).toEqual('/')
    })
  })

  describe('with product name', () => {
    it('renders product name', () => {
      const $ = render('header', examples['with product name'])

      const $component = $('.moaland-header')
      const $productName = $component.find('.moaland-header__product-name')
      expect($productName.text().trim()).toEqual('Product Name')
    })
  })

  describe('with service name', () => {
    it('renders service name', () => {
      const $ = render('header', examples['with service name'])

      const $component = $('.moaland-header')
      const $serviceName = $component.find('.moaland-header__link--service-name')
      expect($serviceName.text().trim()).toEqual('Service Name')
    })

    it('renders with service url', () => {
      const $ = render('header', examples['with service name'])

      const $component = $('.moaland-header')
      const $serviceName = $component.find('.moaland-header__link--service-name')
      expect($serviceName.attr('href')).toEqual('/components/header')
    })
  })

  describe('with navigation', () => {
    it('passes accessibility tests', async () => {
      const $ = render('header', examples['with navigation'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders navigation', () => {
      const $ = render('header', examples['with navigation'])

      const $component = $('.moaland-header')
      const $list = $component.find('ul.moaland-header__navigation')
      const $items = $list.find('li.moaland-header__navigation-item')
      const $firstItem = $items.find('a.moaland-header__link:first-child')
      expect($items.length).toEqual(4)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Navigation item 1')
    })

    it('renders navigation default label correctly', () => {
      const $ = render('header', examples['with navigation'])

      const $component = $('.moaland-header')
      const $list = $component.find('ul.moaland-header__navigation')

      expect($list.attr('aria-label')).toEqual('Navigation menu')
    })

    it('allows navigation label to be customised', () => {
      const $ = render('header', examples['with custom navigation label'])

      const $component = $('.moaland-header')
      const $list = $component.find('ul.moaland-header__navigation')

      expect($list.attr('aria-label')).toEqual('Custom navigation label')
    })

    it('renders navigation with active item', () => {
      const $ = render('header', examples['with navigation'])

      const $activeItem = $('a.moaland-header__navigation-item:first-child')
      expect($activeItem.hasClass('moaland-header__navigation-item--active'))
    })

    it('allows navigation item text to be passed whilst escaping HTML entities', () => {
      const $ = render('header', examples['navigation item with html as text'])

      const $navigationLink = $('.moaland-header__navigation-item a')
      expect($navigationLink.html()).toContain('&lt;em&gt;Navigation item 1&lt;/em&gt;')
    })

    it('allows navigation item HTML to be passed un-escaped', () => {
      const $ = render('header', examples['navigation item with html'])

      const $navigationLink = $('.moaland-header__navigation-item a')
      expect($navigationLink.html()).toContain('<em>Navigation item 1</em>')
    })

    it('renders navigation item with text without a link', () => {
      const $ = render('header', examples['navigation item with text without link'])

      const $navigationItem = $('.moaland-header__navigation-item')
      expect($navigationItem.html().trim()).toEqual('Navigation item 1')
    })

    it('renders navigation item with html without a link', () => {
      const $ = render('header', examples['navigation item with html without link'])

      const $navigationItem = $('.moaland-header__navigation-item')
      expect($navigationItem.html()).toContain('<em>Navigation item 1</em>')
    })

    it('renders navigation item anchor with attributes', () => {
      const $ = render('header', examples['navigation item with attributes'])

      const $navigationLink = $('.moaland-header__navigation-item a')
      expect($navigationLink.attr('data-attribute')).toEqual('my-attribute')
      expect($navigationLink.attr('data-attribute-2')).toEqual('my-attribute-2')
    })

    describe('menu button', () => {
      it('has an explicit type="button" so it does not act as a submit button', () => {
        const $ = render('header', examples['with navigation'])

        const $button = $('.moaland-header__menu-button')

        expect($button.attr('type')).toEqual('button')
      })
      it('renders default label correctly', () => {
        const $ = render('header', examples['with navigation'])

        const $button = $('.moaland-header__menu-button')

        expect($button.attr('aria-label')).toEqual('Show or hide navigation menu')
      })
      it('allows label to be customised', () => {
        const $ = render('header', examples['with custom menu button label'])

        const $button = $('.moaland-header__menu-button')

        expect($button.attr('aria-label')).toEqual('Custom button label')
      })
    })
  })

  describe('SVG logo', () => {
    const $ = render('header', examples.default)
    const $svg = $('.moaland-header__logotype-crown')

    it('sets focusable="false" so that IE does not treat it as an interactive element', () => {
      expect($svg.attr('focusable')).toEqual('false')
    })

    it('sets aria-hidden="true" so that it is ignored by assistive technologies', () => {
      expect($svg.attr('aria-hidden')).toEqual('true')
    })

    describe('fallback PNG', () => {
      const $fallbackImage = $('.moaland-header__logotype-crown-fallback-image')

      it('uses the <image> tag which is a valid SVG element', () => {
        expect($fallbackImage[0].tagName).toEqual('image')
      })

      it('sets a blank xlink:href to prevent IE from downloading both the SVG and the PNG', () => {
        // Cheerio converts xhref to href - https://github.com/cheeriojs/cheerio/issues/1101
        expect($fallbackImage.attr('href')).toEqual('')
      })
    })
  })
})
