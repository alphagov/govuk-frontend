/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('footer')

describe('footer', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('footer', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('entire component must have a role of `contentinfo`', () => {
    const $ = render('footer', {})

    const $component = $('.govuk-footer')
    expect($component.attr('role')).toEqual('contentinfo')
  })

  it('renders attributes correctly', () => {
    const $ = render('footer', {
      attributes: {
        'data-test-attribute': 'value',
        'data-test-attribute-2': 'value-2'
      }
    })

    const $component = $('.govuk-footer')
    expect($component.attr('data-test-attribute')).toEqual('value')
    expect($component.attr('data-test-attribute-2')).toEqual('value-2')
  })

  it('renders classes', () => {
    const $ = render('footer', {
      classes: 'app-footer--custom-modifier'
    })

    const $component = $('.govuk-footer')
    expect($component.hasClass('app-footer--custom-modifier')).toBeTruthy()
  })

  it('renders custom container classes', () => {
    const $ = render('footer', {
      containerClasses: 'app-width-container'
    })

    const $component = $('.govuk-footer')
    const $container = $component.find('.govuk-width-container')

    expect($container.hasClass('app-width-container')).toBeTruthy()
  })

  describe('meta', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples['with-meta'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders heading', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-footer')
      const $heading = $component.find('h2.govuk-h-visually-hidden')
      expect($heading.text()).toEqual('Support links')
    })

    it('renders links', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-footer')
      const $list = $component.find('ul.govuk-footer__inline-list')
      const $items = $list.find('li.govuk-footer__inline-list-item')
      const $firstItem = $items.find('a.govuk-footer__link:first-child')
      expect($items.length).toEqual(3)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Item 1')
    })
  })

  describe('navigation', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples['with-navigation'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders headings', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-footer')
      const $firstSection = $component.find('.govuk-footer__section:first-child')
      const $lastSection = $component.find('.govuk-footer__section:last-child')
      const $firstHeading = $firstSection.find('h2.govuk-footer__heading')
      const $lastHeading = $lastSection.find('h2.govuk-footer__heading')
      expect($firstHeading.text()).toEqual('Two column list')
      expect($lastHeading.text()).toEqual('Single column list')
    })

    it('renders lists of links', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-footer')
      const $list = $component.find('ul.govuk-footer__list')
      const $items = $list.find('li.govuk-footer__list-item')
      const $firstItem = $items.find('a.govuk-footer__link:first-child')
      expect($items.length).toEqual(9)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Navigation item 1')
    })

    it('renders lists in columns', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-footer')
      const $list = $component.find('ul.govuk-footer__list')
      expect($list.hasClass('govuk-footer__list--columns-2')).toBeTruthy()
    })
  })

  describe('section break', () => {
    it('renders when there is a navigation', () => {
      const $ = render('footer', examples['with-navigation'])

      const $component = $('.govuk-footer')
      const $sectionBreak = $component.find('hr.govuk-footer__section-break')
      expect($sectionBreak.length).toBeTruthy()
    })

    it('renders nothing when there is only meta', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-footer')
      const $sectionBreak = $component.find('hr.govuk-footer__section-break')
      expect($sectionBreak.length).toBeFalsy()
    })
  })
})
