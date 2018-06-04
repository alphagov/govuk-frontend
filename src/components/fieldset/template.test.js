/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('fieldset')

describe('fieldset', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('fieldset', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a legend element inside a fieldset element for accessibility reasons', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?'
      }
    })

    const $component = $('fieldset.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($component.get(0).tagName).toContain('fieldset')
    expect($legend.get(0).tagName).toContain('legend')
  })

  it('renders classes', () => {
    const $ = render('fieldset', {
      classes: 'app-fieldset--custom-modifier'
    })

    const $component = $('.govuk-fieldset')
    expect($component.hasClass('app-fieldset--custom-modifier')).toBeTruthy()
  })

  it('renders legend text using markup that is semantic', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?'
      }
    })

    const $component = $('fieldset.govuk-fieldset')
    const $legend = $component.find('legend.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is your address?')
  })

  it('renders legend text when legend is passed as a string', () => {
    const $ = render('fieldset', {
      legend: 'What is your address?'
    })

    const $component = $('fieldset.govuk-fieldset')
    const $legend = $component.find('legend.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is your address?')
  })

  it('renders escaped legend text when passing html', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is <b>your</b> address?'
      }
    })

    const $component = $('.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is &lt;b&gt;your&lt;/b&gt; address?')
  })

  it('renders legend HTML', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is <b>your</b> address?',
        safe: true
      }
    })

    const $component = $('.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is <b>your</b> address?')
  })

  it('allows for additional classes on the legend', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?',
        classes: 'my-custom-class'
      }
    })

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.hasClass('my-custom-class')).toBeTruthy()
  })

  it('can nest the contents of the legend in an H1 if using legend.isPageHeading', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?',
        isPageHeading: true
      }
    })

    const $headingInsideLegend = $('.govuk-fieldset__legend > h1')
    expect($headingInsideLegend.text().trim()).toBe('What is your address?')
  })

  it('renders attributes', () => {
    const $ = render('fieldset', {
      attributes: {
        'data-attribute': 'value',
        'data-another-attribute': 'another-value'
      }
    })

    const $component = $('.govuk-fieldset')
    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-another-attribute')).toEqual('another-value')
  })

  describe('with keyword arguments', () => {
    it('allows fieldset params to be passed as keyword arguments', () => {
      const $ = renderMacro('fieldset', null, {
        legend: {
          text: '<b>legend text</b>',
          safe: true
        },
        describedBy: 'describedById',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-fieldset')
      expect($component.html()).toContain('<b>legend text</b>')
      expect($component.attr('aria-describedby')).toEqual('describedById')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses legend keyword argument before params.legend', () => {
      const $ = renderMacro('fieldset', {
        legend: {
          text: 'params text'
        }
      }, {
        legend: {
          text: 'keyword text'
        }
      })

      const $legend = $('.govuk-fieldset__legend')
      expect($legend.html()).toContain('keyword text')
    })

    it('uses describedBy keyword argument before params.describedBy', () => {
      const $ = renderMacro('fieldset', {
        describedBy: 'paramsId'
      }, {
        describedBy: 'keywordId'
      })

      const $component = $('.govuk-fieldset')
      expect($component.attr('aria-describedby')).toContain('keywordId')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('fieldset', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-fieldset')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('fieldset', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-fieldset')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })
})
