/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('skip-link')

describe('Skip link', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('skip-link', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders href', () => {
    const $ = render('skip-link', {
      href: '#custom'
    })

    const $component = $('.govuk-skip-link')
    expect($component.attr('href')).toEqual('#custom')
  })

  it('renders default href', () => {
    const $ = render('skip-link', {})

    const $component = $('.govuk-skip-link')
    expect($component.attr('href')).toEqual('#content')
  })

  it('renders text', () => {
    const $ = render('skip-link', {
      text: 'skip'
    })

    const $component = $('.govuk-skip-link')
    expect($component.html()).toEqual('skip')
  })

  it('renders escaped html in text', () => {
    const $ = render('skip-link', {
      text: '<p>skip</p>'
    })

    const $component = $('.govuk-skip-link')
    expect($component.html()).toEqual('&lt;p&gt;skip&lt;/p&gt;')
  })

  it('renders html', () => {
    const $ = render('skip-link', {
      text: '<p>skip</p>',
      safe: true
    })

    const $component = $('.govuk-skip-link')
    expect($component.html()).toEqual('<p>skip</p>')
  })

  it('renders classes', () => {
    const $ = render('skip-link', {
      classes: 'app-skip-link--custom-class'
    })

    const $component = $('.govuk-skip-link')
    expect($component.hasClass('app-skip-link--custom-class')).toBeTruthy()
  })

  it('renders attributes', () => {
    const $ = render('skip-link', {
      attributes: {
        'data-test': 'attribute',
        'aria-label': 'Skip to content'
      }
    })

    const $component = $('.govuk-skip-link')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('aria-label')).toEqual('Skip to content')
  })

  describe('with keyword arguments', () => {
    it('allows skip link to be passed as string', () => {
      const $ = renderMacro('skip-link', 'text as string')

      const $component = $('.govuk-skip-link')
      expect($component.text()).toContain('text as string')
    })

    it('allows skip link params to be passed as keyword arguments', () => {
      const $ = renderMacro('skip-link', null, {
        text: '<span>Hello</span>',
        safe: true,
        href: 'hrefValue',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-skip-link')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('href')).toEqual('hrefValue')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('skip-link', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-skip-link')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('skip-link', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-skip-link')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('skip-link', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-skip-link')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses href keyword argument before params.href', () => {
      const $ = renderMacro('skip-link', {
        href: 'paramsHref'
      }, {
        href: 'keywordHref'
      })

      const $component = $('.govuk-skip-link')
      expect($component.attr('href')).toContain('keywordHref')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('skip-link', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-skip-link')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('skip-link', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-skip-link')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('skip-link', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukSkipLink</strong>')
    })
  })
})
