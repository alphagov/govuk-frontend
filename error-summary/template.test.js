/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('error-summary')

describe('Error-summary', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('error-summary', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('aria-labelledby attribute matches the title id', () => {
    const $ = render('error-summary', examples.default)
    const ariaAttr = $('.govuk-c-error-summary').attr('aria-labelledby')

    expect(ariaAttr).toEqual('error-summary-title')
  })

  it('has role=alert attribute', () => {
    const $ = render('error-summary', examples.default)
    const roleAttr = $('.govuk-c-error-summary').attr('role')

    expect(roleAttr).toEqual('alert')
  })

  it('has the correct tabindex attribute to be focussed', () => {
    const $ = render('error-summary', examples.default)
    const tabindexAttr = $('.govuk-c-error-summary').attr('tabindex')

    expect(tabindexAttr).toEqual('-1')
  })

  it('renders title text', () => {
    const $ = render('error-summary', examples.default)
    const summaryTitle = $('.govuk-c-error-summary__title').text().trim()

    expect(summaryTitle).toEqual('Message to alert the user to a problem goes here')
  })

  it('allows title text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      titleText: 'Alert, <em>alert</em>'
    })

    const summaryTitle = $('.govuk-c-error-summary__title').html().trim()
    expect(summaryTitle).toEqual('Alert, &lt;em&gt;alert&lt;/em&gt;')
  })

  it('allows title HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      titleHtml: 'Alert, <em>alert</em>'
    })

    const summaryTitle = $('.govuk-c-error-summary__title').html().trim()
    expect(summaryTitle).toEqual('Alert, <em>alert</em>')
  })

  it('renders description text', () => {
    const $ = render('error-summary', examples.default)
    const summaryDescription = $('.govuk-c-error-summary__body p').text().trim()

    expect(summaryDescription).toEqual('Optional description of the errors and how to correct them')
  })

  it('allows description text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      descriptionText: 'See errors below (▼)'
    })

    const summaryDescription = $('.govuk-c-error-summary__body p').html().trim()
    expect(summaryDescription).toEqual('See errors below (&#x25BC;)')
  })

  it('allows description HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      descriptionHtml: 'See <span>errors</span> below'
    })

    const summaryDescription = $('.govuk-c-error-summary__body p').html().trim()
    expect(summaryDescription).toEqual('See <span>errors</span> below')
  })

  it('allows additional classes to be added to the error-summary component', () => {
    const $ = render('error-summary', {
      classes: 'extra-class one-more-class'
    })

    const $component = $('.govuk-c-error-summary')
    expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the error-summary component', () => {
    const $ = render('error-summary', {
      attributes: {
        'first-attribute': 'true',
        'second-attribute': 'false'
      }
    })

    const $component = $('.govuk-c-error-summary')
    expect($component.attr('first-attribute')).toEqual('true')
    expect($component.attr('second-attribute')).toEqual('false')
  })

  it('number of error items matches the number of items specified', () => {
    const $ = render('error-summary', examples.default)
    const errorList = $('.govuk-c-error-summary .govuk-c-error-summary__list li')

    expect(errorList).toHaveLength(2)
  })

  it('error list item is an anchor tag if href attribute is specified', () => {
    const $ = render('error-summary', examples.default)

    const errorItem = $('.govuk-c-error-summary .govuk-c-error-summary__list li:first-child')
    expect(errorItem.children().get(0).tagName).toEqual('a')
  })

  it('render anchor tag href attribute is correctly', () => {
    const $ = render('error-summary', examples.default)

    const errorItem = $('.govuk-c-error-summary .govuk-c-error-summary__list li:first-child a')
    expect(errorItem.attr('href')).toEqual('#example-error-1')
  })

  it('renders error item text', () => {
    const $ = render('error-summary', examples.default)
    const errorItemText = $('.govuk-c-error-summary .govuk-c-error-summary__list li:first-child').text().trim()

    expect(errorItemText).toEqual('Descriptive link to the question with an error')
  })

  it('allows error item HTML to be passed un-escaped', () => {
    const $ = render('error-summary', {
      'errorList': [
        {
          'html': 'Descriptive link to the <b>question</b> with an error'
        }
      ]
    })

    const errorItemText = $('.govuk-c-error-summary .govuk-c-error-summary__list li').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the <b>question</b> with an error')
  })

  it('allows error item text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      'errorList': [
        {
          'text': 'Descriptive link to the <b>question</b> with an error'
        }
      ]
    })

    const errorItemText = $('.govuk-c-error-summary .govuk-c-error-summary__list li').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
  })

  it('allows error item HTML inside "a" tag to be passed un-escaped', () => {
    const $ = render('error-summary', {
      'errorList': [
        {
          'html': 'Descriptive link to the <b>question</b> with an error',
          'href': '#error-1'
        }
      ]
    })

    const errorItemText = $('.govuk-c-error-summary .govuk-c-error-summary__list li a').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the <b>question</b> with an error')
  })

  it('allows error item text inside "a" tag to be passed whilst escaping HTML entities', () => {
    const $ = render('error-summary', {
      'errorList': [
        {
          'text': 'Descriptive link to the <b>question</b> with an error',
          'href': '#error-1'
        }
      ]
    })

    const errorItemText = $('.govuk-c-error-summary .govuk-c-error-summary__list li a').html().trim()

    expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
  })
})
