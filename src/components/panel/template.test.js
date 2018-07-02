/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

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
      titleText: 'Application <strong>not</strong> complete'
    })

    const panelTitle = $('.govuk-panel__title').html().trim()
    expect(panelTitle).toEqual('Application &lt;strong&gt;not&lt;/strong&gt; complete')
  })

  it('renders title as h2 (as the default heading level)', () => {
    const $ = render('panel', examples.default)
    const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

    expect(panelTitleHeadingLevel).toEqual('h2')
  })

  it('renders title as specified heading level', () => {
    const $ = render('panel', {
      headingLevel: 3
    })
    const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

    expect(panelTitleHeadingLevel).toEqual('h3')
  })

  it('allows title HTML to be passed un-escaped', () => {
    const $ = render('panel', {
      titleHtml: 'Application <strong>not</strong> complete'
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
      html: 'Your reference number<br><strong>HDJ2123F</strong>'
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
      titleText: 'Application complete'
    })
    const panelBody = $('.govuk-panel__body').length

    expect(panelBody).toBeFalsy()
  })
})
