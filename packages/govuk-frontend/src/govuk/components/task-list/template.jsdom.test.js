const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Task List', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('task-list')
  })

  it('renders the default example', () => {
    document.body.innerHTML = render('task-list', examples.default)

    const $component = document.querySelector('.govuk-task-list')
    expect($component.tagName).toBe('UL')
  })

  describe('when custom classes are passed', () => {
    let $component

    beforeAll(() => {
      document.body.innerHTML = render('task-list', examples['custom classes'])
      $component = document.querySelector('.govuk-task-list')
    })

    it('includes additional classes from the `classes` option on the root', () => {
      expect($component).toHaveClass('custom-class-on-component')
    })

    it('includes additional classes from the `item.classes` option on the item', () => {
      const $listItem = $component.querySelector('.govuk-task-list__item')
      expect($listItem).toHaveClass('custom-class-on-task')
    })

    it('includes additional classes from the `item.status.classes` option on the status', () => {
      const $status = $component.querySelector('.govuk-task-list__status')
      expect($status).toHaveClass('custom-class-on-status')
    })

    describe('when a task has a tag status', () => {
      it('allows for custom classes on tags', () => {
        const $tag = document.querySelector(
          '.govuk-task-list__status .govuk-tag'
        )
        expect($tag).toHaveClass('custom-class-on-tag')
      })
    })

    describe('when a task has an href set', () => {
      it('includes classes from the `item.title.classes` option on the link', () => {
        const $itemWithLink = $component.querySelector(
          '.govuk-task-list__item:first-child'
        )
        const $link = $itemWithLink.querySelector('.govuk-task-list__link')

        expect($link).toHaveClass('custom-class-on-linked-title')
      })
    })

    describe('when a task does not have an href set', () => {
      it('includes classes from the `item.title.classes` option on the wrapper div', () => {
        const $itemWithoutLink = $component.querySelector(
          '.govuk-task-list__item:last-child'
        )
        const $wrapper = $itemWithoutLink.querySelector(
          '.govuk-task-list__name-and-hint div'
        )

        expect($wrapper).toHaveClass('custom-class-on-unlinked-title')
      })
    })
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('task-list', examples['custom attributes'])

    const $component = document.querySelector('.govuk-task-list')
    expect($component).toHaveAttribute('data-custom-attribute', 'custom-value')
  })

  it('sets any additional attributes on tags based on `item.status.tag.attributes` option', () => {
    document.body.innerHTML = render('task-list', examples['custom attributes'])

    const $component = document.querySelector('.govuk-tag')
    expect($component).toHaveAttribute('data-tag-attribute', 'tag-value')
  })

  describe('when a task has an href set', () => {
    let $item
    let $itemLink

    beforeAll(function () {
      document.body.innerHTML = render('task-list', examples.default)
      $item = document.querySelector('.govuk-task-list__item')
      $itemLink = document.querySelector('a.govuk-task-list__link')
    })

    it('wraps the task title in a link', async () => {
      expect($itemLink).toHaveAttribute('href', '#')
    })

    it('adds a with-link modifier class to the task', async () => {
      expect($item).toHaveClass('govuk-task-list__item--with-link')
    })

    it('associates the task name link with the status using aria', async () => {
      expect($itemLink).toHaveAccessibleDescription('Completed')
    })
  })

  describe('when a task does not have an href set', () => {
    it('does not link the task title', () => {
      document.body.innerHTML = render(
        'task-list',
        examples['example with hint text and additional states']
      )

      const $itemWithNoLink = document.querySelector(
        '.govuk-task-list__item:last-child'
      )

      expect($itemWithNoLink.querySelector('a')).toBeNull()
    })
  })

  describe('when using the `text` option', () => {
    beforeAll(() => {
      document.body.innerHTML = render(
        'task-list',
        examples['html passed as text']
      )
    })

    describe('when a task has an href set', () => {
      it('escapes HTML in the link', () => {
        const $itemWithLink = document.querySelector(
          '.govuk-task-list__item:first-child'
        )
        const $link = $itemWithLink.querySelector('.govuk-task-list__link')
        expect($link).toHaveTextContent('<strong>Linked Title</strong>')
      })
    })

    describe('when a task does not have an href set', () => {
      it('escapes the title', () => {
        const $itemWithoutLink = document.querySelector(
          '.govuk-task-list__item:last-child'
        )
        const $title = $itemWithoutLink.querySelector(
          '.govuk-task-list__name-and-hint'
        )

        expect($title).toHaveTextContent('<strong>Unlinked Title</strong>')
      })
    })

    describe('when a task has a tag status', () => {
      it('escapes HTML in the tag', () => {
        const $tag = document.querySelector('.govuk-tag')
        expect($tag).toHaveTextContent('<strong>Tag</strong>')
      })
    })

    describe('when a task has a non-tag status', () => {
      it('escapes HTML in the status', () => {
        const $status = document.querySelector('.govuk-task-list__status')
        expect($status).toHaveTextContent('<strong>Status</strong>')
      })
    })

    it('escapes HTML in the hint', () => {
      const $hint = document.querySelector('.govuk-task-list__hint')
      expect($hint).toHaveTextContent('<strong>Hint</strong>')
    })
  })

  describe('when using the `html` option', () => {
    beforeAll(() => {
      document.body.innerHTML = render('task-list', examples.html)
    })

    describe('when a task has an href set', () => {
      it('does not escape HTML in the link', () => {
        const $itemWithLink = document.querySelector(
          '.govuk-task-list__item:first-child'
        )
        const $link = $itemWithLink.querySelector('.govuk-task-list__link')

        expect($link).toContainHTML('<strong>Linked Title</strong>')
      })
    })

    describe('when a task does not have an href set', () => {
      it('does not escape HTML in the title', () => {
        const $itemWithoutLink = document.querySelector(
          '.govuk-task-list__item:last-child'
        )
        const $title = $itemWithoutLink.querySelector(
          '.govuk-task-list__name-and-hint'
        )

        expect($title).toContainHTML('<strong>Unlinked Title</strong>')
      })
    })

    describe('when a task has a tag status', () => {
      it('does not escape HTML in the tag', () => {
        const $tag = document.querySelector('.govuk-tag')
        expect($tag).toContainHTML('<strong>Tag</strong>')
      })
    })

    describe('when a task has a non-tag status', () => {
      it('does not escape HTML in the status', () => {
        const $status = document.querySelector('.govuk-task-list__status')
        expect($status).toContainHTML('<strong>Status</strong>')
      })
    })

    it('does not escape HTML in the hint', () => {
      const $hint = document.querySelector('.govuk-task-list__hint')
      expect($hint).toContainHTML('<strong>Hint</strong>')
    })
  })

  describe('when a task has a hint', () => {
    let $component

    beforeAll(function () {
      document.body.innerHTML = render(
        'task-list',
        examples['example with hint text and additional states']
      )
      $component = document.querySelector('.govuk-task-list')
    })

    it('renders the hint', () => {
      const $hintText = $component.querySelector('.govuk-task-list__hint')
      expect($hintText).toHaveTextContent(
        'Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.'
      )
    })

    it('associates the hint text and the status with the task link', () => {
      const $task = $component.querySelector(
        '.govuk-task-list__item:nth-child(3)'
      )

      const $link = $task.querySelector('.govuk-task-list__link')
      const $hint = $task.querySelector('.govuk-task-list__hint')
      const $status = $task.querySelector('.govuk-task-list__status')

      expect($link).toHaveAccessibleDescription(
        [$hint, $status].map((el) => el.textContent.trim()).join(' ')
      )
    })
  })

  describe('when a custom idPrefix is used', () => {
    let $component

    beforeAll(function () {
      document.body.innerHTML = render(
        'task-list',
        examples['custom id prefix']
      )
      $component = document.querySelector('.govuk-task-list')
    })

    it('uses the id prefix for the hint id', () => {
      const $hint = $component.querySelector('.govuk-task-list__hint')
      expect($hint).toHaveAttribute('id', 'my-custom-id-1-hint')
    })

    it('uses the id prefix for the status', () => {
      const $status = $component.querySelector('.govuk-task-list__status')
      expect($status).toHaveAttribute('id', 'my-custom-id-1-status')
    })

    it('uses the id prefix for the aria-describedby association', () => {
      const $link = $component.querySelector('.govuk-task-list__link')
      expect($link).toHaveAttribute('aria-describedby')
    })
  })

  it('omits empty items from the task list', () => {
    document.body.innerHTML = render('task-list', examples['with empty values'])

    expect(document.querySelectorAll('.govuk-task-list__item')).toHaveLength(2)
  })
})
