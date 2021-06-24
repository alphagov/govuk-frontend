const { render } = require('govuk-frontend-helpers/nunjucks')
const { getExamples } = require('govuk-frontend-lib/files')

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

    it('associates the task name link with the status using aria', async () => {
      const $ = render('task-list', examples.default)

      const $component = $('.govuk-task-list')

      const $itemLink = $component.find('.govuk-task-list__link')
      expect($itemLink.get(0).tagName).toEqual('a')
      expect($itemLink.attr('href')).toEqual('#')

      const statusId = 'task-list-example-1-status'
      expect($itemLink.attr('aria-describedby')).toEqual(statusId)

      const $statusWithId = $component.find(`#${statusId}`)
      expect($statusWithId.get(0).tagName).toEqual('div')

      expect($statusWithId.text()).toContain('Completed')
      expect($statusWithId.hasClass('govuk-task-list__status')).toBeTruthy()
    })
  })

  describe('example with no link, hint text and additional states', () => {
    it('doesn’t include a link in the item with no href', () => {
      const $ = render('task-list', examples['example with hint text and additional states'])

      const $itemWithNoLink = $('.app-task-list__item--no-link')
      expect($itemWithNoLink.get(0).tagName).toEqual('li')

      const $itemWithNoLinkTitle = $itemWithNoLink.find('div')
      expect($itemWithNoLinkTitle.text()).toContain('Payment')
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

      const $itemAssociatedWithHint = $(`.govuk-task-list__link[aria-describedby~="${$hintText.attr('id')}"]`)
      expect($itemAssociatedWithHint.text()).toContain('Business plan')
    })
  })
})
