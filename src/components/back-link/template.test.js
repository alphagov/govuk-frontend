/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('back-link')

describe('back-link component', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('back-link', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it.skip('fails to render if the required fields are not included', () => {
    // TODO: href is a required field but the component does not error,
    // when it is not passed
    expect(() => {
      render('back-link', {
        text: 'Example'
      })
    }).toThrow()
  })

  it('renders the default example with an anchor, href and text correctly', () => {
    const $ = render('back-link', examples.default)

    const $component = $('.govuk-back-link')
    expect($component.get(0).tagName).toEqual('a')
    expect($component.attr('href')).toEqual('https://gov.uk')
    expect($component.text()).toEqual('Back')
  })

  it('renders classes correctly', () => {
    const $ = render('back-link', {
      classes: 'app-back-link--custom-class',
      href: '#',
      text: '<b>Back</b>',
      safe: true
    })

    const $component = $('.govuk-back-link')
    expect($component.hasClass('app-back-link--custom-class')).toBeTruthy()
  })

  it('renders custom text correctly', () => {
    const $ = render('back-link', {
      href: '#',
      text: 'Home'
    })

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('Home')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('back-link', {
      href: '#',
      text: '<b>Home</b>'
    })

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('&lt;b&gt;Home&lt;/b&gt;')
  })

  it('renders html correctly', () => {
    const $ = render('back-link', {
      href: '#',
      text: '<b>Back</b>',
      safe: true
    })

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('<b>Back</b>')
  })

  it('renders attributes correctly', () => {
    const $ = render('back-link', {
      attributes: {
        'data-test': 'attribute',
        'aria-label': 'Back to home'
      },
      href: '#',
      text: 'Back'
    })

    const $component = $('.govuk-back-link')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('aria-label')).toEqual('Back to home')
  })

  describe('with keyword arguments', () => {
    it('allows back-link to be passed as string', () => {
      const $ = renderMacro('back-link', 'text as string')

      const $component = $('.govuk-back-link')
      expect($component.text()).toContain('text as string')
    })

    it('allows back-link params to be passed as keyword arguments', () => {
      const $ = renderMacro('back-link', null, {
        text: '<span>Hello</span>',
        safe: true,
        href: '/backUrl',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-back-link')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('href')).toContain('/backUrl')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('back-link', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-back-link')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('back-link', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-back-link')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('back-link', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-back-link')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses href keyword argument before params.href', () => {
      const $ = renderMacro('back-link', {
        href: '/paramsUrl'
      }, {
        href: '/keywordUrl'
      })

      const $component = $('.govuk-back-link')
      expect($component.attr('href')).toEqual('/keywordUrl')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('back-link', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-back-link')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('back-link', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-back-link')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('back-link', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukBackLink</strong>')
    })
  })
})
