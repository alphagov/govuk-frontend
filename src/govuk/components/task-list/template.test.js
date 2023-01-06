/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const { axe, render, getExamples } = require('../../../../lib/jest-helpers')

describe('Task List', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('task-list')
  })

  describe('default example', () => {
    it('renders the default example', () => {
      const $ = render('task-list', examples.default)

      const $component = $('.govuk-task-list')
      expect($component.get(0).tagName).toEqual('ul')

      const $items = $component.find('.govuk-task-list__item')
      expect($items.length).toEqual(3)

      expect($items.get(0).tagName).toEqual('li')
      expect($items.hasClass('govuk-task-list__item--with-link')).toBeTruthy()
    })

    it('passes accessibility tests', async () => {
      const $ = render('task-list', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('associates the task name link with the status label using aria', async () => {
      const $ = render('task-list', examples.default)

      const $itemLink = $('.govuk-task-list__link')
      expect($itemLink.get(0).tagName).toEqual('a')
      expect($itemLink.attr('href')).toEqual('#')

      expect($itemLink.attr('aria-describedby')).toEqual('task-list-example-1-status')

      const $statusWithId = $('#' + $itemLink.attr('aria-describedby'))
      expect($statusWithId.get(0).tagName).toEqual('span')
      expect($statusWithId.text()).toContain('Completed')
      expect($statusWithId.hasClass('govuk-task-list__status')).toBeTruthy()
    })
  })

  describe('example with hint text and additional states', () => {
    it('doesn’t include a link in the item with no href', () => {
      const $ = render('task-list', examples['example with hint text and additional states'])

      const $itemWithNoLink = $('.govuk-task-list__task-no-link')
      expect($itemWithNoLink.get(0).tagName).toEqual('div')
      expect($itemWithNoLink.text()).toContain('Payment')
    })

    it('renders hint text', () => {
      const $ = render('task-list', examples['example with hint text and additional states'])

      const $hintText = $('.govuk-task-list__task_hint')
      expect($hintText.get(0).tagName).toEqual('div')
      expect($hintText.text()).toContain('Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.')
    })

    it('associates the hint text with the task link using aria', () => {
      const $ = render('task-list', examples['example with hint text and additional states'])

      const $hintText = $('.govuk-task-list__task_hint')
      expect($hintText.attr('id')).toEqual('task-list-example-3-hint')

      const $itemAssociatedWithHint = $('.govuk-task-list__link[aria-describedby~="' + $hintText.attr('id') + '"]')
      expect($itemAssociatedWithHint.text()).toContain('Business plan')
    })
  })
})
