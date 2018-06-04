/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

      const $component = $('.govuk-phase-banner')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('renders banner text', () => {
      const $ = render('phase-banner', {
        text: 'This is a new service – your feedback will help us to improve it.'
      })
      const phaseBannerText = $('.govuk-phase-banner__text').text().trim()

      expect(phaseBannerText).toEqual('This is a new service – your feedback will help us to improve it.')
    })

    it('allows body text to be passed whilst escaping HTML entities', () => {
      const $ = render('phase-banner', {
        text: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
      })

      const phaseBannerText = $('.govuk-phase-banner__text').html().trim()
      expect(phaseBannerText).toEqual('This is a new service - your &lt;a href=&quot;#&quot; class=&quot;govuk-link&quot;&gt;feedback&lt;/a&gt; will help us to improve it.')
    })

    it('allows body HTML to be passed un-escaped', () => {
      const $ = render('phase-banner', examples.default)

      const phaseBannerText = $('.govuk-phase-banner__text').html().trim()
      expect(phaseBannerText).toEqual('This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.')
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('phase-banner', {
        attributes: {
          'first-attribute': 'true',
          'second-attribute': 'false'
        }
      })

      const $component = $('.govuk-phase-banner')
      expect($component.attr('first-attribute')).toEqual('true')
      expect($component.attr('second-attribute')).toEqual('false')
    })
  })
  describe('with dependant components', () => {
    it('renders the tag component text', () => {
      const $ = render('phase-banner', examples.default)

      expect(htmlWithClassName($, '.govuk-phase-banner__content__tag')).toMatchSnapshot()
    })

    it('renders the tag component html', () => {
      const $ = render('phase-banner', {
        'tag': {
          'text': '<em>alpha</em>',
          'safe': true
        }
      })

      expect(htmlWithClassName($, '.govuk-phase-banner__content__tag')).toMatchSnapshot()
    })

    it('renders the tag component classes', () => {
      const $ = render('phase-banner', {
        'tag': {
          'text': 'alpha',
          'classes': 'govuk-tag--inactive'
        }
      })

      expect(htmlWithClassName($, '.govuk-phase-banner__content__tag')).toMatchSnapshot()
    })
  })

  describe('with keyword arguments', () => {
    it('allows phase banner to be passed as string', () => {
      const $ = renderMacro('phase-banner', 'text as string')

      const $component = $('.govuk-phase-banner')
      expect($component.text()).toContain('text as string')
    })

    it('allows phase banner params to be passed as keyword arguments', () => {
      const $ = renderMacro('phase-banner', null, {
        text: '<span>Hello</span>',
        safe: true,
        tag: {
          text: 'tag text'
        },
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-phase-banner')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.html()).toContain('tag text')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('phase-banner', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-phase-banner')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('phase-banner', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-phase-banner')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('phase-banner', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-phase-banner')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses tag keyword argument before params.tag', () => {
      const $ = renderMacro('phase-banner', {
        tag: {
          text: 'params text'
        }
      }, {
        tag: {
          text: 'keywords text'
        }
      })

      const $component = $('.govuk-phase-banner')
      expect($component.html()).toContain('keywords text')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('phase-banner', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-phase-banner')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('phase-banner', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-phase-banner')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('phase-banner', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukPhaseBanner</strong>')
    })
  })
})
