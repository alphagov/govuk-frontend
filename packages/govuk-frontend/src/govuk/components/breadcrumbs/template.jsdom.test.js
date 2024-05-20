const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Breadcrumbs', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('breadcrumbs')
  })

  describe('default example', () => {
    let $component, $list, $listItems

    beforeAll(() => {
      document.body.innerHTML = render('breadcrumbs', examples.default)

      $component = document.querySelector('.govuk-breadcrumbs')
      $list = document.querySelector('ol.govuk-breadcrumbs__list')
      $listItems = document.querySelectorAll('li.govuk-breadcrumbs__list-item')
    })

    it('renders as a nav element', () => {
      expect($component.tagName.toLowerCase()).toBe('nav')
    })

    it('renders with default aria-label', () => {
      expect($component).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('includes an ordered list', () => {
      expect($component).toContainElement($list)
    })

    it('includes 2 list items within the list', () => {
      expect($listItems).toHaveLength(2)
    })

    describe.each([
      { index: 0, expectedText: 'Section', expectedHref: '/section' },
      {
        index: 1,
        expectedText: 'Sub-section',
        expectedHref: '/section/sub-section'
      }
    ])(
      'the "$expectedText" breadcrumb',
      ({ index, expectedText, expectedHref }) => {
        it(`includes the text "${expectedText}"`, () => {
          expect($listItems[index]).toHaveTextContent(expectedText)
        })

        it(`includes a link with the class govuk-breadcrumbs__link`, () => {
          expect($listItems[index].querySelector('a')).toHaveClass(
            'govuk-breadcrumbs__link'
          )
        })

        it(`includes a link with the href "${expectedHref}"`, () => {
          expect($listItems[index].querySelector('a')).toHaveAttribute(
            'href',
            expectedHref
          )
        })
      }
    )
  })

  describe('when the last breadcrumb is the current page', () => {
    let $lastItem

    beforeAll(() => {
      document.body.innerHTML = render(
        'breadcrumbs',
        examples['with last breadcrumb as current page']
      )

      $lastItem = document.querySelector(
        '.govuk-breadcrumbs__list-item:last-child'
      )
    })

    it('includes the current page as the last list item', () => {
      expect($lastItem).toHaveTextContent('Travel abroad')
    })

    it('does not link the last list item', () => {
      expect($lastItem.querySelector('a')).toBeNull()
    })

    it('sets the aria-current attribute to "page"', () => {
      expect($lastItem).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('custom options', () => {
    it('escapes HTML when using the `text` option', () => {
      document.body.innerHTML = render('breadcrumbs', examples['html as text'])
      const $item = document.querySelector('.govuk-breadcrumbs__list-item')

      expect($item).toHaveTextContent('<span>Section 1</span>')
    })

    it('escapes HTML when using the `text` option without a link', () => {
      document.body.innerHTML = render('breadcrumbs', examples['html as text'])
      const $item = document.querySelector(
        '.govuk-breadcrumbs__list-item:nth-child(2)'
      )

      expect($item).toHaveTextContent('<span>Section 2</span>')
    })

    it('does not escape HTML when using the `html` option', () => {
      document.body.innerHTML = render('breadcrumbs', examples.html)
      const $item = document.querySelector('.govuk-breadcrumbs__list-item')

      expect($item).toContainHTML('<em>Section 1</em>')
    })

    it('does not escape HTML when using the `html` option without a link', () => {
      document.body.innerHTML = render('breadcrumbs', examples.html)
      const $item = document.querySelector(
        '.govuk-breadcrumbs__list-item:nth-child(2)'
      )

      expect($item).toContainHTML('<em>Section 2</em>')
    })

    it('sets any additional attributes on the link based on the `item.attributes` option', () => {
      document.body.innerHTML = render(
        'breadcrumbs',
        examples['item attributes']
      )
      const $breadcrumbLink = document.querySelector('.govuk-breadcrumbs__link')

      expect($breadcrumbLink).toHaveAttribute('data-attribute', 'my-attribute')
      expect($breadcrumbLink).toHaveAttribute(
        'data-attribute-2',
        'my-attribute-2'
      )
    })

    it('includes additional classes from the `classes` option', () => {
      document.body.innerHTML = render('breadcrumbs', examples.classes)

      const $component = document.querySelector('.govuk-breadcrumbs')
      expect($component).toHaveClass('app-breadcrumbs--custom-modifier')
    })

    it('adds the `--collapse-on-mobile` modifier class if `collapseOnMobile` is true', () => {
      document.body.innerHTML = render(
        'breadcrumbs',
        examples['with collapse on mobile']
      )

      const $component = document.querySelector('.govuk-breadcrumbs')
      expect($component).toHaveClass('govuk-breadcrumbs--collapse-on-mobile')
    })

    it('sets any additional attributes based on the `attributes` option', () => {
      document.body.innerHTML = render('breadcrumbs', examples.attributes)

      const $component = document.querySelector('.govuk-breadcrumbs')
      expect($component).toHaveAttribute('id', 'my-navigation')
      expect($component).toHaveAttribute('data-foo', 'bar')
    })

    it('renders with a custom aria-label', () => {
      document.body.innerHTML = render('breadcrumbs', examples['custom label'])

      const $component = document.querySelector('.govuk-breadcrumbs')
      expect($component).toHaveAttribute('aria-label', 'Briwsion bara')
    })
  })
})
