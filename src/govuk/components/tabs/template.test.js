const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Tabs', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('tabs')
  })

  describe('default example', () => {
    it('renders the first tab selected', () => {
      const $ = render('tabs', examples.default)

      const $tab = $('[href="#past-day"]').parent()
      expect($tab.hasClass('govuk-tabs__list-item--selected')).toBeTruthy()
    })

    it('hides all but the first panel', () => {
      const $ = render('tabs', examples.default)

      expect($('#past-week').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
      expect(
        $('#past-month').hasClass('govuk-tabs__panel--hidden')
      ).toBeTruthy()
      expect($('#past-year').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('tabs', examples.classes)

      const $component = $('.govuk-tabs')
      expect($component.hasClass('app-tabs--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('tabs', examples.id)

      const $component = $('.govuk-tabs')
      expect($component.attr('id')).toBe('my-tabs')
    })

    it('allows custom title text to be passed', () => {
      const $ = render('tabs', examples.title)

      const content = $('.govuk-tabs__title').html().trim()
      expect(content).toBe('Custom title for Contents')
    })

    it('renders with attributes', () => {
      const $ = render('tabs', examples.attributes)

      const $component = $('.govuk-tabs')
      expect($component.attr('data-attribute')).toBe('my data value')
    })
  })

  describe('items', () => {
    it("doesn't render a list if items is not defined", () => {
      const $ = render('tabs', examples['no item list'])

      const $component = $('.govuk-tabs')
      expect($component.find('.govuk-tabs__list')).toHaveLength(0)
    })

    it("doesn't render a list if items is empty", () => {
      const $ = render('tabs', examples['empty item list'])

      const $component = $('.govuk-tabs')
      expect($component.find('.govuk-tabs__list')).toHaveLength(0)
    })

    it('render a matching tab and panel using item id', () => {
      const $ = render('tabs', examples.default)

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find(
        '.govuk-tabs__list-item:first-child .govuk-tabs__tab'
      )
      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstTab.attr('href')).toBe('#past-day')
      expect($firstPanel.attr('id')).toBe('past-day')
    })

    it('render without falsy values', () => {
      const $ = render('tabs', examples['with falsy values'])

      const $component = $('.govuk-tabs')

      const $items = $component.find('.govuk-tabs__list-item')
      expect($items).toHaveLength(2)
    })

    it('render a matching tab and panel using custom idPrefix', () => {
      const $ = render('tabs', examples.idPrefix)

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find(
        '.govuk-tabs__list-item:first-child .govuk-tabs__tab'
      )
      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstTab.attr('href')).toBe('#custom-1')
      expect($firstPanel.attr('id')).toBe('custom-1')
    })

    it('render the label', () => {
      const $ = render('tabs', examples.default)

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find(
        '.govuk-tabs__list-item:first-child .govuk-tabs__tab'
      )
      expect($firstTab.text().trim()).toBe('Past day')
    })

    it('render with panel content as text, wrapped in styled paragraph', () => {
      const $ = render('tabs', examples.default)
      const $component = $('.govuk-tabs')
      const $lastTab = $component.find('.govuk-tabs__panel').last()

      expect($lastTab.find('p').hasClass('govuk-body')).toBeTruthy()
      expect($lastTab.text().trim()).toBe(
        'There is no data for this year yet, check back later'
      )
    })

    it('render escaped html when passed to text content', () => {
      const $ = render('tabs', examples['html as text'])

      const $component = $('.govuk-tabs')

      const $firstPanel = $component.find('.govuk-tabs__panel .govuk-body')
      expect($firstPanel.html().trim()).toBe(
        '&lt;p&gt;Panel 1 content&lt;/p&gt;'
      )
    })

    it('render html when passed to content', () => {
      const $ = render('tabs', examples.html)

      const $component = $('.govuk-tabs')

      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstPanel.html().trim()).toBe('<p>Panel 1 content</p>')
    })

    it('render a tab anchor with attributes', () => {
      const $ = render('tabs', examples['item with attributes'])

      const $tabItemLink = $('.govuk-tabs__tab')
      expect($tabItemLink.attr('data-attribute')).toBe('my-attribute')
      expect($tabItemLink.attr('data-attribute-2')).toBe('my-attribute-2')
    })

    it('render a tab panel with attributes', () => {
      const $ = render('tabs', examples['panel with attributes'])

      const $tabPanelItems = $('.govuk-tabs__panel')
      expect($tabPanelItems.attr('data-attribute')).toBe('my-attribute')
      expect($tabPanelItems.attr('data-attribute-2')).toBe('my-attribute-2')
    })
  })
})
