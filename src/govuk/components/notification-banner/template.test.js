/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('notification-banner')

describe('Notification-banner', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('notification-banner', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('aria-labelledby attribute matches the title id', () => {
      const $ = render('notification-banner', examples.default)
      const ariaAttr = $('.govuk-notification-banner').attr('aria-labelledby')

      expect(ariaAttr).toEqual('govuk-notification-banner-title')
    })

    it('has role=region attribute', () => {
      const $ = render('notification-banner', examples.default)
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('region')
    })

    it('does not have tabindex set', () => {
      const $ = render('notification-banner', examples.default)

      const $component = $('.govuk-notification-banner')
      expect($component.attr('tabindex')).toBeFalsy()
    })

    it('does not have data-module attribute to focus component on page load', () => {
      const $ = render('notification-banner', examples.default)
      const $component = $('.govuk-notification-banner')

      expect($component.attr('data-module')).not.toEqual('govuk-initial-focus')
    })

    it('renders header container', () => {
      const $ = render('notification-banner', examples.default)
      const $header = $('.govuk-notification-banner__header')

      expect($header.length).toBeTruthy()
    })

    it('renders default heading level', () => {
      const $ = render('notification-banner', examples.default)
      const $title = $('.govuk-notification-banner__title')

      expect($title.get(0).tagName).toEqual('h2')
    })

    it('renders default title text', () => {
      const $ = render('notification-banner', examples.default)
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Important')
    })

    it('title id matches the aria-labelledby attribute on the component', () => {
      const $ = render('notification-banner', examples.default)
      const $title = $('.govuk-notification-banner__title')

      expect($title.attr('id')).toEqual('govuk-notification-banner-title')
    })

    it('renders content', () => {
      const $ = render('notification-banner', examples.default)
      const $content = $('.govuk-notification-banner__content')

      expect($content.html().trim()).toEqual('You have 9 days to send a response.')
    })
  })

  describe('custom options', () => {
    it('renders custom title', () => {
      const $ = render('notification-banner', examples['custom title'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Important information')
    })

    it('renders custom content', () => {
      const $ = render('notification-banner', examples['custom content'])
      const $content = $('.govuk-notification-banner__content')

      expect($content.html().trim()).toEqual('This publication was withdrawn on 7 March 2014.')
    })

    it('renders custom heading level', () => {
      const $ = render('notification-banner', examples['custom title heading level'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.get(0).tagName).toEqual('h3')
    })

    it('renders custom role', () => {
      const $ = render('notification-banner', examples['custom role'])
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('banner')
    })

    it('renders custom tabindex', () => {
      const $ = render('notification-banner', examples['custom tabindex'])
      const $component = $('.govuk-notification-banner')

      expect($component.attr('tabindex')).toEqual('0')
    })

    it('renders data-module attribute to focus component on page load', () => {
      const $ = render('notification-banner', examples['initialFocus as true'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-module')).toEqual('govuk-initial-focus')
    })

    it('removes data-module attribute so component is not focused on page load', () => {
      const $ = render('notification-banner', examples['initialFocus as false and type as success'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-module')).toBeFalsy()
    })

    it('renders classes', () => {
      const $ = render('notification-banner', examples.classes)

      const $component = $('.govuk-notification-banner')
      expect($component.hasClass('app-my-class')).toBeTruthy()
    })

    it('renders attributes', () => {
      const $ = render('notification-banner', examples.attributes)

      const $component = $('.govuk-notification-banner')
      expect($component.attr('my-attribute')).toEqual('value')
    })
  })

  describe('html', () => {
    it('renders title as escaped html when passed as text', () => {
      const $ = render('notification-banner', examples['title html as text'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('&lt;span&gt;Important information&lt;/span&gt;')
    })

    it('renders title as html', () => {
      const $ = render('notification-banner', examples['title as html'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('<span>Important information</span>')
    })

    it('renders content as escaped html when passed as text', () => {
      const $ = render('notification-banner', examples['content html as text'])
      const $content = $('.govuk-notification-banner__content')

      expect($content.html().trim()).toEqual('&lt;span&gt;This publication was withdrawn on 7 March 2014.&lt;/span&gt;')
    })

    it('renders content as html', () => {
      const $ = render('notification-banner', examples['with content as html'])
      const $contentHtml = $('.govuk-notification-banner__content')

      expect($contentHtml.html().trim()).toEqual('<h3 class="govuk-heading-m">This publication was withdrawn on 7 March 2014</h3><p>Archived and replaced by the <a href="#">new planning guidance</a> launched 6 March 2014 on an external website</p>')
    })
  })

  describe('when success type is passed', () => {
    it('renders with appropriate class', () => {
      const $ = render('notification-banner', examples['with type as success'])

      const $component = $('.govuk-notification-banner')
      expect($component.hasClass('govuk-notification-banner--success')).toBeTruthy()
    })

    it('has role=alert attribute', () => {
      const $ = render('notification-banner', examples['with type as success'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('role')).toEqual('alert')
    })

    it('has the correct tabindex attribute to be focused', () => {
      const $ = render('notification-banner', examples['with type as success'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('tabindex')).toEqual('-1')
    })

    it('renders data-module attribute to focus component on page load', () => {
      const $ = render('notification-banner', examples['with type as success'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-module')).toEqual('govuk-initial-focus')
    })

    it('renders default success title text', () => {
      const $ = render('notification-banner', examples['with type as success'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Success')
    })
  })

  describe('when error type is passed', () => {
    it('renders with appropriate class', () => {
      const $ = render('notification-banner', examples['with type as error'])

      const $component = $('.govuk-notification-banner')
      expect($component.hasClass('govuk-notification-banner--error')).toBeTruthy()
    })

    it('has role=alert attribute', () => {
      const $ = render('notification-banner', examples['with type as error'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('role')).toEqual('alert')
    })

    it('has the correct tabindex attribute to be focused', () => {
      const $ = render('notification-banner', examples['with type as error'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('tabindex')).toEqual('-1')
    })

    it('renders data-module attribute to focus component on page load', () => {
      const $ = render('notification-banner', examples['with type as error'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-module')).toEqual('govuk-initial-focus')
    })

    it('renders default error title text', () => {
      const $ = render('notification-banner', examples['with type as error'])
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Error')
    })
  })

  describe('when type that is invalid is passed', () => {
    it('has role=region attribute', () => {
      const $ = render('notification-banner', examples['with invalid type'])
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('region')
    })

    it('does not have tabindex set', () => {
      const $ = render('notification-banner', examples['with invalid type'])

      const $component = $('.govuk-notification-banner')
      expect($component.attr('tabindex')).toBeFalsy()
    })

    it('does not have data-module attribute to focus component on page load', () => {
      const $ = render('notification-banner', examples['with invalid type'])
      const $component = $('.govuk-notification-banner')

      expect($component.attr('data-module')).not.toEqual('govuk-initial-focus')
    })
  })
})
