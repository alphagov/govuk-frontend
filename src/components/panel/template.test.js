/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('panel')

describe('Panel', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('panel', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders title text', () => {
    const $ = render('panel', examples.default)
    const panelTitle = $('.govuk-panel__title').text().trim()

    expect(panelTitle).toEqual('Application complete')
  })

  it('allows title text to be passed whilst escaping HTML entities', () => {
    const $ = render('panel', {
      title: {
        text: 'Application <strong>not</strong> complete'
      }
    })

    const panelTitle = $('.govuk-panel__title').html().trim()
    expect(panelTitle).toEqual('Application &lt;strong&gt;not&lt;/strong&gt; complete')
  })

  it('allows title HTML to be passed un-escaped', () => {
    const $ = render('panel', {
      title: {
        text: 'Application <strong>not</strong> complete',
        safe: true
      }
    })

    const panelTitle = $('.govuk-panel__title').html().trim()
    expect(panelTitle).toEqual('Application <strong>not</strong> complete')
  })

  it('renders body text', () => {
    const $ = render('panel', examples.default)
    const panelBodyText = $('.govuk-panel__body').text().trim()

    expect(panelBodyText).toEqual('Your reference number: HDJ2123F')
  })

  it('allows body text to be passed whilst escaping HTML entities', () => {
    const $ = render('panel', {
      text: 'Your reference number<br><strong>HDJ2123F</strong>'
    })

    const panelBodyText = $('.govuk-panel__body').html().trim()
    expect(panelBodyText).toEqual('Your reference number&lt;br&gt;&lt;strong&gt;HDJ2123F&lt;/strong&gt;')
  })

  it('allows body HTML to be passed un-escaped', () => {
    const $ = render('panel', {
      text: 'Your reference number<br><strong>HDJ2123F</strong>',
      safe: true
    })

    const panelBodyText = $('.govuk-panel__body').html().trim()
    expect(panelBodyText).toEqual('Your reference number<br><strong>HDJ2123F</strong>')
  })

  it('allows additional classes to be added to the component', () => {
    const $ = render('panel', {
      classes: 'extra-class one-more-class'
    })

    const $component = $('.govuk-panel')
    expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the component', () => {
    const $ = render('panel', {
      attributes: {
        'first-attribute': 'true',
        'second-attribute': 'false'
      }
    })

    const $component = $('.govuk-panel')
    expect($component.attr('first-attribute')).toEqual('true')
    expect($component.attr('second-attribute')).toEqual('false')
  })

  it('doesnt render panel body if no body text is passed', () => {
    const $ = render('panel', {
      title: {
        text: 'Application complete'
      }
    })
    const panelBody = $('.govuk-panel__body').length

    expect(panelBody).toBeFalsy()
  })

  describe('with keyword arguments', () => {
    it('should not allow panel to be passed as string', () => {
      const $ = renderMacro('panel', 'text as string')

      const $component = $('.govuk-panel')
      expect($component.text()).not.toContain('text as string')
    })

    it('allows panel params to be passed as keyword arguments', () => {
      const $ = renderMacro('panel', null, {
        text: '<span>Hello</span>',
        safe: true,
        title: {
          text: 'title text'
        },
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-panel')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.html()).toContain('title text')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('panel', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-panel')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('panel', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-panel')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('panel', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-panel')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses title keyword argument before params.title', () => {
      const $ = renderMacro('panel', {
        title: {
          text: 'params text'
        }
      }, {
        title: {
          text: 'keywords text'
        }
      })

      const $component = $('.govuk-panel')
      expect($component.html()).toContain('keywords text')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('panel', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-panel')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('panel', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-panel')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('panel', {
        html: '<b>params text</b>',
        title: {
          html: '<b>params text</b>'
        }
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukPanel</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.title.html is deprecated in govukPanel</strong>')
    })
  })
})
