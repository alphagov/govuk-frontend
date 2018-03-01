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

  describe('meta', () => {
    it('passes accessibility tests', async () => {
      const $ = render('footer', examples['with-meta'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders heading', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-c-footer')
      const $heading = $component.find('h2.govuk-h-visually-hidden')
      expect($heading.text()).toEqual('Support links')
    })

    it('renders links', () => {
      const $ = render('footer', examples['with-meta'])

      const $component = $('.govuk-c-footer')
      const $list = $component.find('ul.govuk-c-footer__inline-list')
      const $items = $list.find('li.govuk-c-footer__inline-list-item')
      const $firstItem = $items.find('a.govuk-c-footer__link:first-child')
      expect($items.length).toEqual(3)
      expect($firstItem.attr('href')).toEqual('#1')
      expect($firstItem.text()).toContain('Item 1')
    })
  })
})
