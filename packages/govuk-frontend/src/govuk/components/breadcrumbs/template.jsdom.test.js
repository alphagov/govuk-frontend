const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Breadcrumbs', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('breadcrumbs')
  })

  describe('default example', () => {
    it('renders with items', () => {
      const $ = render('breadcrumbs', examples.default)

      const $items = $('.govuk-breadcrumbs__list-item')
      expect($items).toHaveLength(2)
    })

    it('renders 2 items', () => {
      const $ = render('breadcrumbs', examples.default)
      const $items = $('.govuk-breadcrumbs__list-item')
      expect($items).toHaveLength(2)
    })

    it('renders item with anchor', () => {
      const $ = render('breadcrumbs', examples.default)

      const $anchor = $('.govuk-breadcrumbs__list-item a').first()
      expect($anchor.get(0).tagName).toBe('a')
      expect($anchor.attr('class')).toBe('govuk-breadcrumbs__link')
      expect($anchor.attr('href')).toBe('/section')
      expect($anchor.text()).toBe('Section')
    })
  })

  describe('custom options', () => {
    it('renders item with text', () => {
      const $ = render(
        'breadcrumbs',
        examples['with last breadcrumb as current page']
      )

      const $item = $('.govuk-breadcrumbs__list-item').last()
      expect($item.text()).toBe('Travel abroad')
    })

    it('renders item with escaped entities in text', () => {
      const $ = render('breadcrumbs', examples['html as text'])

      const $item = $('.govuk-breadcrumbs__list-item')
      expect($item.html()).toBe('&lt;span&gt;Section 1&lt;/span&gt;')
    })

    it('renders item with html', () => {
      const $ = render('breadcrumbs', examples.html)

      const $item = $('.govuk-breadcrumbs__list-item').first()
      expect($item.html()).toBe('<em>Section 1</em>')
    })

    it('renders item with html inside anchor', () => {
      const $ = render('breadcrumbs', examples.html)

      const $anchor = $('.govuk-breadcrumbs__list-item a').last()
      expect($anchor.html()).toBe('<em>Section 2</em>')
    })

    it('renders item anchor with attributes', () => {
      const $ = render('breadcrumbs', examples['item attributes'])

      const $breadcrumbLink = $('.govuk-breadcrumbs__link')
      expect($breadcrumbLink.attr('data-attribute')).toBe('my-attribute')
      expect($breadcrumbLink.attr('data-attribute-2')).toBe('my-attribute-2')
    })

    it('renders with classes', () => {
      const $ = render('breadcrumbs', examples.classes)

      const $component = $('.govuk-breadcrumbs')
      expect(
        $component.hasClass('app-breadcrumbs--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('breadcrumbs', examples.attributes)

      const $component = $('.govuk-breadcrumbs')
      expect($component.attr('id')).toBe('my-navigation')
      expect($component.attr('role')).toBe('navigation')
    })

    it('renders item as collapse on mobile if specified', () => {
      const $ = render('breadcrumbs', examples['with collapse on mobile'])

      const $component = $('.govuk-breadcrumbs')
      expect(
        $component.hasClass('govuk-breadcrumbs--collapse-on-mobile')
      ).toBeTruthy()
    })
  })
})
