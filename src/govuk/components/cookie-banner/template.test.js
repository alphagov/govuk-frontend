/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('cookie-banner')

describe('Cookie Banner', () => {
  describe('question banner', () => {
    it('passes accessibility tests', async () => {
      const $ = render('cookie-banner', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a heading', () => {
      const $ = render('cookie-banner', examples.default)

      const $heading = $('.govuk-cookie-banner__heading')
      expect($heading.text()).toEqual('Cookies on this government service')
    })

    it('renders heading as escaped html when passed as text', () => {
      const $ = render('cookie-banner', examples['heading html as text'])

      const $heading = $('.govuk-cookie-banner__heading')
      expect($heading.html().trim()).toEqual('Cookies on &lt;span&gt;my service&lt;/span&gt;')
    })

    it('renders heading html', () => {
      const $ = render('cookie-banner', examples['heading html'])

      const $heading = $('.govuk-cookie-banner__heading')
      expect($heading.html().trim()).toEqual('Cookies on <span>my service</span>')
    })

    it('renders main content text', () => {
      const $ = render('cookie-banner', examples.default)

      const $content = $('.govuk-cookie-banner__content')
      expect($content.text()).toEqual('We use analytics cookies to help understand how users use our service.')
    })

    it('renders main content html', () => {
      const $ = render('cookie-banner', examples.html)

      const $content = $('.govuk-cookie-banner__content')
      expect($content.html().trim()).toEqual('<p class="govuk-body">We use cookies in <span>our service</span>.</p>')
    })

    it('renders classes', () => {
      const $ = render('cookie-banner', examples.classes)

      const $banner = $('.govuk-cookie-banner .govuk-cookie-banner__message')

      expect($banner.hasClass('app-my-class')).toBeTruthy()
    })

    it('renders attributes', () => {
      const $ = render('cookie-banner', examples.attributes)

      const $banner = $('.govuk-cookie-banner .govuk-cookie-banner__message')

      expect($banner.attr('data-attribute')).toEqual('my-value')
    })
  })

  describe('role and aria attributes', () => {
    it('has a role of region', () => {
      const $ = render('cookie-banner', examples.default)

      const $component = $('.govuk-cookie-banner')
      expect($component.attr('role')).toEqual('region')
    })

    it('has a default aria-label', () => {
      const $ = render('cookie-banner', examples.default)

      const $component = $('.govuk-cookie-banner')
      expect($component.attr('aria-label')).toEqual('Cookie banner')
    })

    it('renders a custom aria label', () => {
      const $ = render('cookie-banner', examples['custom aria label'])

      const $component = $('.govuk-cookie-banner')
      expect($component.attr('aria-label')).toEqual('Cookies on GOV.UK')
    })
  })

  describe('confirmation banner', () => {
    it('passes accessibility tests', async () => {
      const $ = render('cookie-banner', examples['accepted confirmation banner'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('role alert not set by default', () => {
      const $ = render('cookie-banner', examples.default)

      const $component = $('.govuk-cookie-banner')
      const $banner = $component.find('.govuk-cookie-banner__message')
      expect($banner.attr('role')).toBeUndefined()
    })

    it('sets role attribute when role provided', () => {
      const $ = render('cookie-banner', examples['accepted confirmation banner'])

      const $component = $('.govuk-cookie-banner')
      const $banner = $component.find('.govuk-cookie-banner__message')
      expect($banner.attr('role')).toEqual('alert')
    })

    it('hides banner if hidden option set to true', () => {
      const $ = render('cookie-banner', examples.hidden)

      const $component = $('.govuk-cookie-banner__message')
      expect($component.attr('hidden')).toBeTruthy()
    })

    it('does not hide banner if hidden option set to false', () => {
      const $ = render('cookie-banner', examples['hidden false'])

      const $component = $('.govuk-cookie-banner__message')
      expect($component.attr('hidden')).toBeUndefined()
    })
  })

  describe('action', () => {
    it('renders as button by default', () => {
      const $ = render('cookie-banner', examples['default action'])

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.get(0).tagName).toEqual('button')
    })

    it('renders as a link if href provided', () => {
      const $ = render('cookie-banner', examples.link)

      const $actions = $('.govuk-cookie-banner .govuk-link')
      expect($actions.get(0).tagName).toEqual('a')
    })

    it('ignores other button options if href provided', () => {
      const $ = render('cookie-banner', examples['link with false button options'])

      const $actions = $('.govuk-cookie-banner .govuk-link')
      expect($actions.get(0).tagName).toEqual('a')
      expect($actions.text()).toEqual('This is a link')
      expect($actions.attr('href')).toEqual('/link')

      expect($actions.attr('value')).toBeUndefined()
      expect($actions.attr('name')).toBeUndefined()
    })

    it('renders as a link button if href and type=button provided', () => {
      const $ = render('cookie-banner', examples['link as a button'])

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.get(0).tagName).toEqual('a')
      expect($actions.text().trim()).toEqual('This is a link')
      expect($actions.attr('href')).toEqual('/link')
      expect($actions.attr('role')).toEqual('button')
    })

    it('renders button text', () => {
      const $ = render('cookie-banner', examples['default action'])

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.text().trim()).toEqual('This is a button')
    })

    it('renders button with custom type', () => {
      const $ = render('cookie-banner', examples.type)

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.attr('type')).toEqual('button')
    })

    it('renders button with name', () => {
      const $ = render('cookie-banner', examples.default)

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.attr('name')).toEqual('cookies')
    })

    it('renders button with value', () => {
      const $ = render('cookie-banner', examples.default)

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.attr('value')).toEqual('accept')
    })

    it('renders button with additional classes', () => {
      const $ = render('cookie-banner', examples['button classes'])

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.attr('class')).toEqual('govuk-button my-button-class app-button-class')
    })

    it('renders button with custom attributes', () => {
      const $ = render('cookie-banner', examples['button attributes'])

      const $actions = $('.govuk-cookie-banner .govuk-button')
      expect($actions.attr('data-button-attribute')).toEqual('my-value')
    })

    it('renders link text and href', () => {
      const $ = render('cookie-banner', examples.link)

      const $actions = $('.govuk-cookie-banner .govuk-link')
      expect($actions.text()).toEqual('This is a link')
      expect($actions.attr('href')).toEqual('/link')
    })

    it('renders link with additional classes', () => {
      const $ = render('cookie-banner', examples['link classes'])

      const $actions = $('.govuk-cookie-banner .govuk-link')
      expect($actions.attr('class')).toEqual('govuk-link my-link-class app-link-class')
    })

    it('renders link with custom attributes', () => {
      const $ = render('cookie-banner', examples['link attributes'])

      const $actions = $('.govuk-cookie-banner .govuk-link')
      expect($actions.attr('data-link-attribute')).toEqual('my-value')
    })
  })

  describe('client-side implementation example', () => {
    it('renders 3 banners', () => {
      const $ = render('cookie-banner', examples['client-side implementation'])

      const $actions = $('.govuk-cookie-banner__message')
      expect($actions.length).toEqual(3)
    })

    it('2 banners are hidden', () => {
      const $ = render('cookie-banner', examples['client-side implementation'])

      const $actions = $('.govuk-cookie-banner__message[hidden]')
      expect($actions.length).toEqual(2)
    })

    it('has a data-nosnippet attribute to hide it from search result snippets', () => {
      const $ = render('cookie-banner', examples['client-side implementation'])

      const $parentContainer = $('.govuk-cookie-banner')
      expect($parentContainer.attr('data-nosnippet')).toEqual('')
    })
  })

  describe('full cookie banner hidden', () => {
    it('HTML for 3 banners is present', () => {
      const $ = render('cookie-banner', examples['full banner hidden'])

      const $messages = $('.govuk-cookie-banner__message')
      expect($messages.length).toEqual(3)
    })

    it('parent banner is hidden', () => {
      const $ = render('cookie-banner', examples['full banner hidden'])

      const $cookieBanner = $('.govuk-cookie-banner[hidden]')
      expect($cookieBanner.length).toEqual(1)
    })

    it('adds classes to parent container when provided', () => {
      const $ = render('cookie-banner', examples['full banner hidden'])

      const $cookieBanner = $('.govuk-cookie-banner')
      expect($cookieBanner.hasClass('hide-cookie-banner')).toBeTruthy()
    })

    it('adds attributes to parent container when provided', () => {
      const $ = render('cookie-banner', examples['full banner hidden'])

      const $cookieBanner = $('.govuk-cookie-banner')
      expect($cookieBanner.attr('data-hide-cookie-banner')).toEqual('true')
    })
  })
})
