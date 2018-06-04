/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('error-summary')

describe('Error-summary', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('error-summary', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('aria-labelledby attribute matches the title id', () => {
    const $ = render('error-summary', examples.default)
    const ariaAttr = $('.govuk-error-summary').attr('aria-labelledby')

    expect(ariaAttr).toEqual('error-summary-title')
  })

  it('has role=alert attribute', () => {
    const $ = render('error-summary', examples.default)
    const roleAttr = $('.govuk-error-summary').attr('role')

    expect(roleAttr).toEqual('alert')
  })

  it('has the correct tabindex attribute to be focussed', () => {
    const $ = render('error-summary', examples.default)
    const tabindexAttr = $('.govuk-error-summary').attr('tabindex')

    expect(tabindexAttr).toEqual('-1')
  })

  it('renders title text', () => {
    const $ = render('error-summary', examples.default)
    const summaryTitle = $('.govuk-error-summary__title').text().trim()

    expect(summaryTitle).toEqual('Message to alert the user to a problem goes here')
  })

  it('allows title text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      title: {
        text: 'Alert, <em>alert</em>'
      }
    })

    const summaryTitle = $('.govuk-error-summary__title').html().trim()
    expect(summaryTitle).toEqual('Alert, &lt;em&gt;alert&lt;/em&gt;')
  })

  it('allows title HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      title: {
        text: 'Alert, <em>alert</em>',
        safe: true
      }
    })

    const summaryTitle = $('.govuk-error-summary__title').html().trim()
    expect(summaryTitle).toEqual('Alert, <em>alert</em>')
  })

  it('renders description text', () => {
    const $ = render('error-summary', examples.default)
    const summaryDescription = $('.govuk-error-summary__body p').text().trim()

    expect(summaryDescription).toEqual('Optional description of the errors and how to correct them')
  })

  it('allows description text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      description: {
        text: 'See errors below (▼)'
      }
    })

    const summaryDescription = $('.govuk-error-summary__body p').html().trim()
    expect(summaryDescription).toEqual('See errors below (&#x25BC;)')
  })

  it('allows description HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      description: {
        text: 'See <span>errors</span> below',
        safe: true
      }
    })

    const summaryDescription = $('.govuk-error-summary__body p').html().trim()
    expect(summaryDescription).toEqual('See <span>errors</span> below')
  })

  it('allows additional classes to be added to the error-summary component', () => {
    const $ = render('error-summary', {
      classes: 'extra-class one-more-class'
    })

    const $component = $('.govuk-error-summary')
    expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the error-summary component', () => {
    const $ = render('error-summary', {
      attributes: {
        'first-attribute': 'true',
        'second-attribute': 'false'
      }
    })

    const $component = $('.govuk-error-summary')
    expect($component.attr('first-attribute')).toEqual('true')
    expect($component.attr('second-attribute')).toEqual('false')
  })

  it('number of error items matches the number of items specified', () => {
    const $ = render('error-summary', examples.default)
    const errorList = $('.govuk-error-summary .govuk-error-summary__list li')

    expect(errorList).toHaveLength(2)
  })

  it('error list item is an anchor tag if href attribute is specified', () => {
    const $ = render('error-summary', examples.default)

    const errorItem = $('.govuk-error-summary .govuk-error-summary__list li:first-child')
    expect(errorItem.children().get(0).tagName).toEqual('a')
  })

  it('render anchor tag href attribute is correctly', () => {
    const $ = render('error-summary', examples.default)

    const errorItem = $('.govuk-error-summary .govuk-error-summary__list li:first-child a')
    expect(errorItem.attr('href')).toEqual('#example-error-1')
  })

  it('renders error item text', () => {
    const $ = render('error-summary', examples.default)
    const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li:first-child').text().trim()

    expect(errorItemText).toEqual('Descriptive link to the question with an error')
  })

  it('allows error item HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error',
          safe: true
        }
      ]
    })

    const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the <b>question</b> with an error')
  })

  it('allows error item text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error'
        }
      ]
    })

    const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
  })

  it('allows error item HTML inside "a" tag to be passed un-escaped', () => {
    const $ = render('error-summary', {
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error',
          safe: true,
          href: '#error-1'
        }
      ]
    })

    const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li a').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the <b>question</b> with an error')
  })

  it('allows error item text inside "a" tag to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error',
          href: '#error-1'
        }
      ]
    })

    const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li a').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
  })

  it('allows title and description to be passed as strings', () => {
    const $ = render('error-summary', examples.strings)

    const summaryTitle = $('.govuk-error-summary__title').text().trim()
    expect(summaryTitle).toEqual('Message to alert the user to a problem goes here')

    const summaryDescription = $('.govuk-error-summary__body p').text().trim()
    expect(summaryDescription).toEqual('Optional description of the errors and how to correct them')
  })

  describe('with keyword arguments', () => {
    it('allows error-summary params to be passed as keyword arguments', () => {
      const $ = renderMacro('error-summary', null, {
        title: {
          text: '<b>title text</b>',
          safe: true
        },
        description: {
          text: '<b>description text</b>',
          safe: true
        },
        errorList: [
          {
            text: 'error text'
          }
        ],
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-error-summary')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')

      expect($('.govuk-error-summary__title').html()).toContain('<b>title text</b>')
      expect($('.govuk-error-summary__body').html()).toContain('<b>description text</b>')

      expect($('.govuk-error-summary__list li').html()).toContain('error text')
    })

    it('uses title keyword argument before params.title', () => {
      const $ = renderMacro('error-summary', {
        title: {
          text: 'params text'
        }
      }, {
        title: {
          text: 'keyword text'
        }
      })

      const $title = $('.govuk-error-summary__title')
      expect($title.html()).toContain('keyword text')
    })

    it('uses description keyword argument before params.description', () => {
      const $ = renderMacro('error-summary', {
        description: {
          text: 'params text'
        }
      }, {
        description: {
          text: 'keyword text'
        }
      })

      const $title = $('.govuk-error-summary__body')
      expect($title.html()).toContain('keyword text')
    })

    it('uses errorList keyword argument before params.errorList', () => {
      const $ = renderMacro('error-summary', {
        errorList: [
          {
            text: 'params text'
          }
        ]
      }, {
        errorList: [
          {
            text: 'keyword text'
          }
        ]
      })

      const $component = $('.govuk-error-summary__list li')
      expect($component.html()).toContain('keyword text')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('error-summary', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-error-summary')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('error-summary', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-error-summary')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('error-summary', {
        titleText: 'title text',
        titleHTML: '<b>title html</b>',
        descriptionText: 'description text',
        descriptionHTML: '<b>description html</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.titleText is deprecated in govukErrorSummary</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.titleHTML is deprecated in govukErrorSummary</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.descriptionText is deprecated in govukErrorSummary</strong>')
      expect($.html()).toContain('<strong class="deprecated">params.descriptionHTML is deprecated in govukErrorSummary</strong>')
    })
  })
})
