/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('panel')

describe('Panel', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('panel', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders title text', () => {
      const $ = render('panel', examples.default)
      const panelTitle = $('.govuk-panel__title').text().trim()

      expect(panelTitle).toEqual('Application complete')
    })

    it('renders title as h1 (as the default heading level)', () => {
      const $ = render('panel', examples.default)
      const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

      expect(panelTitleHeadingLevel).toEqual('h1')
    })

    it('renders body text', () => {
      const $ = render('panel', examples.default)
      const panelBodyText = $('.govuk-panel__body').text().trim()

      expect(panelBodyText).toEqual('Your reference number: HDJ2123F')
    })

    it('doesnt render panel body if no body text is passed', () => {
      const $ = render('panel', examples['title with no body text'])
      const panelBody = $('.govuk-panel__body').length

      expect(panelBody).toBeFalsy()
    })
  })

  describe('custom options', () => {
    it('allows title text to be passed whilst escaping HTML entities', () => {
      const $ = render('panel', examples['title html as text'])

      const panelTitle = $('.govuk-panel__title').html().trim()
      expect(panelTitle).toEqual('Application &lt;strong&gt;not&lt;/strong&gt; complete')
    })

    it('renders title as specified heading level', () => {
      const $ = render('panel', examples['custom heading level'])
      const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

      expect(panelTitleHeadingLevel).toEqual('h2')
    })

    it('allows title HTML to be passed un-escaped', () => {
      const $ = render('panel', examples['title html'])

      const panelTitle = $('.govuk-panel__title').html().trim()
      expect(panelTitle).toEqual('Application <strong>not</strong> complete')
    })

    it('allows body text to be passed whilst escaping HTML entities', () => {
      const $ = render('panel', examples['body html as text'])

      const panelBodyText = $('.govuk-panel__body').html().trim()
      expect(panelBodyText).toEqual('Your reference number&lt;br&gt;&lt;strong&gt;HDJ2123F&lt;/strong&gt;')
    })

    it('allows body HTML to be passed un-escaped', () => {
      const $ = render('panel', examples['body html'])

      const panelBodyText = $('.govuk-panel__body').html().trim()
      expect(panelBodyText).toEqual('Your reference number<br><strong>HDJ2123F</strong>')
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('panel', examples.classes)

      const $component = $('.govuk-panel')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('panel', examples.attributes)

      const $component = $('.govuk-panel')
      expect($component.attr('first-attribute')).toEqual('foo')
      expect($component.attr('second-attribute')).toEqual('bar')
    })
  })
})
