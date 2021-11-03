/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('tag')

describe('Tag', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('tag', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the default example with strong element and text', () => {
      const $ = render('tag', examples.default)

      const $component = $('.govuk-tag')
      expect($component.get(0).tagName).toEqual('strong')
      expect($component.text()).toContain('alpha')
    })

    it('renders classes', () => {
      const $ = render('tag', examples.inactive)

      const $component = $('.govuk-tag')
      expect($component.hasClass('govuk-tag--grey')).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders custom text', () => {
      const $ = render('tag', examples.grey)

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('Grey')
    })

    it('renders attributes', () => {
      const $ = render('tag', examples.attributes)

      const $component = $('.govuk-tag')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('id')).toEqual('my-tag')
    })
  })

  describe('html', () => {
    it('renders escaped html when passed to text', () => {
      const $ = render('tag', examples['html as text'])

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('&lt;span&gt;alpha&lt;/span&gt;')
    })

    it('renders html', () => {
      const $ = render('tag', examples.html)

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('<span>alpha</span>')
    })
  })
})
