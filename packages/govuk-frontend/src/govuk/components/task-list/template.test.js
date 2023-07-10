const { render } = require('govuk-frontend-helpers/nunjucks')
const { getExamples } = require('govuk-frontend-lib/files')

describe('Task List', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('task-list')
  })

  it('renders the default example', () => {
    const $ = render('task-list', examples.default)

    const $component = $('.govuk-task-list')
    expect($component.get(0).tagName).toEqual('ul')
  })

  describe('when a task has an href set', () => {
    let $component

    beforeAll(function () {
      const $ = render('task-list', examples.default)
      $component = $('.govuk-task-list')
    })

    it('wraps the task title in a link', async () => {
      const $itemLink = $component.find('a.govuk-task-list__link')
      expect($itemLink.attr('href')).toEqual('#')
    })

    it('associates the task name link with the status using aria', async () => {
      const $itemLink = $component.find('.govuk-task-list__link')
      const $statusWithId = $component.find(`#${$itemLink.attr('aria-describedby')}`)

      expect($statusWithId.text()).toContain('Completed')
    })
  })

  describe('when a task does not have an href set', () => {
    it('does not link the task title', () => {
      const $ = render('task-list', examples['example with hint text and additional states'])

      const $itemWithNoLink = $('.govuk-task-list__item:last-child')
      const $itemWithNoLinkTitle = $itemWithNoLink.find('div')
      expect($itemWithNoLinkTitle.text()).toContain('Payment')
    })
  })

  describe('when a task has a hint', () => {
    let $component

    beforeAll(function () {
      const $ = render('task-list', examples['example with hint text and additional states'])
      $component = $('.govuk-task-list')
    })

    it('renders the hint', () => {
      const $hintText = $component.find('.govuk-task-list__task_hint')
      expect($hintText.text()).toContain(
        'Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.'
      )
    })

    it('associates the hint text with the task link using aria', () => {
      const $hintText = $component.find('.govuk-task-list__task_hint')
      expect($hintText.attr('id')).toEqual('task-list-example-3-hint')

      const $itemAssociatedWithHint = $component.find(
        `.govuk-task-list__link[aria-describedby~="${$hintText.attr('id')}"]`
      )
      expect($itemAssociatedWithHint.text()).toContain('Business plan')
    })
  })
})
