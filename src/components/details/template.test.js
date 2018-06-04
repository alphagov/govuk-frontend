/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('details')

describe('Details', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('details', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a details element', () => {
    const $ = render('details', examples.default)

    const $component = $('.govuk-details')
    expect($component.get(0).tagName).toEqual('details')
  })

  it('includes a nested summary', () => {
    const $ = render('details', examples.default)

    // Look for the summary element _within_ the details element
    const $summary = $('.govuk-details .govuk-details__summary')
    expect($summary.get(0).tagName).toEqual('summary')
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('details', {
      text: 'More about the greater than symbol (>)'
    })

    const detailsText = $('.govuk-details__text').html().trim()
    expect(detailsText).toEqual('More about the greater than symbol (&gt;)')
  })

  it('allows HTML to be passed un-escaped', () => {
    const $ = render('details', {
      text: 'More about <b>bold text</b>',
      safe: true
    })

    const detailsText = $('.govuk-details__text').html().trim()
    expect(detailsText).toEqual('More about <b>bold text</b>')
  })

  it('allows summary to be passed whilst escaping HTML entities', () => {
    const $ = render('details', {
      summary: {
        text: 'The greater than symbol (>) is the best'
      }
    })

    const detailsText = $('.govuk-details__summary-text').html().trim()
    expect(detailsText).toEqual('The greater than symbol (&gt;) is the best')
  })

  it('allows summary to be passed un-escaped', () => {
    const $ = render('details', {
      summary: {
        text: 'Use <b>bold text</b> sparingly',
        safe: true
      }
    })

    const detailsText = $('.govuk-details__summary-text').html().trim()
    expect(detailsText).toEqual('Use <b>bold text</b> sparingly')
  })

  it('allows summary to be passed as simple string', () => {
    const $ = render('details', examples.simpleSummary)

    const detailsText = $('.govuk-details__summary-text').html().trim()
    expect(detailsText).toEqual('Help with nationality')
  })

  it('allows additional classes to be added to the details element', () => {
    const $ = render('details', {
      classes: 'some-additional-class'
    })

    const $component = $('.govuk-details')
    expect($component.hasClass('some-additional-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the details element', () => {
    const $ = render('details', {
      attributes: {
        'data-some-data-attribute': 'i-love-data',
        'another-attribute': 'true'
      }
    })

    const $component = $('.govuk-details')
    expect($component.attr('data-some-data-attribute')).toEqual('i-love-data')
    expect($component.attr('another-attribute')).toEqual('true')
  })

  describe('with keyword arguments', () => {
    it('should not allow details to be passed as string', () => {
      const $ = renderMacro('details', 'text as string')

      const $component = $('.govuk-details')
      expect($component.text()).not.toContain('text as string')
    })

    it('allows details params to be passed as keyword arguments', () => {
      const $ = renderMacro('details', null, {
        text: '<span>Hello</span>',
        safe: true,
        id: 'id',
        summary: 'summary text',
        open: true,
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-details')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.html()).toContain('summary text')
      expect($component.attr('open')).toContain('open')
      expect($component.attr('id')).toContain('id')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('details', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-details')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('details', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-details')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('details', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-details')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses id keyword argument before params.id', () => {
      const $ = renderMacro('details', {
        id: 'paramsId'
      }, {
        id: 'keywordsId'
      })

      const $component = $('.govuk-details')
      expect($component.attr('id')).toEqual('keywordsId')
    })

    it('uses summary keyword argument before params.summary', () => {
      const $ = renderMacro('details', {
        summary: 'params text'
      }, {
        summary: 'keyword text'
      })

      const $component = $('.govuk-details__summary')
      expect($component.html()).toContain('keyword text')
    })

    it('uses open keyword argument before params.open', () => {
      const $ = renderMacro('details', {
        open: true
      }, {
        open: false
      })

      const $component = $('.govuk-details')
      expect($component.attr('open')).not.toEqual('open')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('details', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-details')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('details', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-details')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('details', {
        html: '<b>params text</b>',
        summaryText: 'summary text',
        summaryHTML: '<b>summary html</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukDetails</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.summaryText is deprecated in govukDetails</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.summaryHTML is deprecated in govukDetails</strong>')
    })
  })
})
