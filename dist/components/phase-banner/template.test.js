/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('phase-banner')

describe('Phase banner', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('phase-banner', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('phase-banner', {
        classes: 'extra-class one-more-class'
      })

      const $component = $('.govuk-c-phase-banner')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('renders banner text', () => {
      const $ = render('phase-banner', {
        text: 'This is a new service – your feedback will help us to improve it.'
      })
      const phaseBannerText = $('.govuk-c-phase-banner__text').text().trim()

      expect(phaseBannerText).toEqual('This is a new service – your feedback will help us to improve it.')
    })

    it('allows body text to be passed whilst escaping HTML entities', () => {
      const $ = render('phase-banner', {
        text: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
      })

      const phaseBannerText = $('.govuk-c-phase-banner__text').html().trim()
      expect(phaseBannerText).toEqual('This is a new service - your &lt;a href=&quot;#&quot; class=&quot;govuk-link&quot;&gt;feedback&lt;/a&gt; will help us to improve it.')
    })

    it('allows body HTML to be passed un-escaped', () => {
      const $ = render('phase-banner', examples.default)

      const phaseBannerText = $('.govuk-c-phase-banner__text').html().trim()
      expect(phaseBannerText).toEqual('This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.')
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('phase-banner', {
        attributes: {
          'first-attribute': 'true',
          'second-attribute': 'false'
        }
      })

      const $component = $('.govuk-c-phase-banner')
      expect($component.attr('first-attribute')).toEqual('true')
      expect($component.attr('second-attribute')).toEqual('false')
    })
  })
  describe('with dependant components', () => {
    it('renders the tag component text', () => {
      const $ = render('phase-banner', examples.default)

      expect(htmlWithClassName($, '.govuk-c-phase-banner__content__tag')).toMatchSnapshot()
    })

    it('renders the tag component html', () => {
      const $ = render('phase-banner', {
        'tag': {
          'html': '<em>alpha</em>'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-phase-banner__content__tag')).toMatchSnapshot()
    })

    it('renders the tag component classes', () => {
      const $ = render('phase-banner', {
        'tag': {
          'text': 'alpha',
          'classes': 'govuk-c-tag--inactive'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-phase-banner__content__tag')).toMatchSnapshot()
    })
  })
})
