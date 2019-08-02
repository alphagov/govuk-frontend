/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('tabs')

describe('Tabs', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('tabs', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('tabs', {
        classes: 'app-tabs--custom-modifier'
      })

      const $component = $('.govuk-tabs')
      expect($component.hasClass('app-tabs--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('tabs', {
        id: 'my-tabs'
      })

      const $component = $('.govuk-tabs')
      expect($component.attr('id')).toEqual('my-tabs')
    })

    it('allows custom title text to be passed', () => {
      const $ = render('tabs', {
        title: 'Custom title for Contents'
      })

      const content = $('.govuk-tabs__title').html().trim()
      expect(content).toEqual('Custom title for Contents')
    })

    it('renders with attributes', () => {
      const $ = render('tabs', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-tabs')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    describe('items', () => {
      it('render a matching tab and panel using item id', () => {
        const $ = render('tabs', {
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              panel: { text: 'Panel 1 content' }
            },
            {
              id: 'tab-2',
              label: 'Tab 2',
              panel: { text: 'Panel 2 content' }
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
        const $firstPanel = $component.find('.govuk-tabs__panel')
        expect($firstTab.attr('href')).toEqual('#tab-1')
        expect($firstPanel.attr('id')).toEqual('tab-1')
      })

      it('render without falsely values', () => {
        const $ = render('tabs', {
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              panel: { text: 'Panel 1 content' }
            },
            undefined,
            null,
            false,
            {
              id: 'tab-2',
              label: 'Tab 2',
              panel: { text: 'Panel 2 content' }
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $items = $component.find('.govuk-tabs__list-item')
        expect($items.length).toEqual(2)
      })

      it('render a matching tab and panel using custom idPrefix', () => {
        const $ = render('tabs', {
          idPrefix: 'custom',
          items: [
            {
              label: 'Tab 1',
              panel: { text: 'Panel 1 content' }
            },
            {
              label: 'Tab 2',
              panel: { text: 'Panel 2 content' }
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
        const $firstPanel = $component.find('.govuk-tabs__panel')
        expect($firstTab.attr('href')).toEqual('#custom-1')
        expect($firstPanel.attr('id')).toEqual('custom-1')
      })

      it('render the label', () => {
        const $ = render('tabs', {
          idPrefix: 'custom',
          items: [
            {
              label: 'Tab 1'
            },
            {
              label: 'Tab 2'
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
        expect($firstTab.text().trim()).toEqual('Tab 1')
      })

      it('render escaped html when passed to text content', () => {
        const $ = render('tabs', {
          idPrefix: 'custom',
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              panel: { text: '<p>Panel 1 content</p>' }
            },
            {
              id: 'tab-2',
              label: 'Tab 2',
              panel: { text: '<p>Panel 2 content</p>' }
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $firstPanel = $component.find('.govuk-tabs__panel')
        expect($firstPanel.html().trim()).toEqual('&lt;p&gt;Panel 1 content&lt;/p&gt;')
      })

      it('render html when passed to content', () => {
        const $ = render('tabs', {
          idPrefix: 'custom',
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              panel: { html: '<p>Panel 1 content</p>' }
            },
            {
              id: 'tab-2',
              label: 'Tab 2',
              panel: { html: '<p>Panel 2 content</p>' }
            }
          ]
        })

        const $component = $('.govuk-tabs')

        const $firstPanel = $component.find('.govuk-tabs__panel')
        expect($firstPanel.html().trim()).toEqual('<p>Panel 1 content</p>')
      })

      it('render a tab anchor with attributes', () => {
        const $ = render('tabs', {
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              attributes: {
                'data-attribute': 'my-attribute',
                'data-attribute-2': 'my-attribute-2'
              }
            }
          ]
        })

        const $tabItemLink = $('.govuk-tabs__tab')
        expect($tabItemLink.attr('data-attribute')).toEqual('my-attribute')
        expect($tabItemLink.attr('data-attribute-2')).toEqual('my-attribute-2')
      })

      it('render a tab panel with attributes', () => {
        const $ = render('tabs', {
          items: [
            {
              id: 'tab-1',
              label: 'Tab 1',
              panel: {
                text: 'Panel text',
                attributes: {
                  'data-attribute': 'my-attribute',
                  'data-attribute-2': 'my-attribute-2'
                }
              }
            }
          ]
        })

        const $tabPanelItems = $('.govuk-tabs__panel')
        expect($tabPanelItems.attr('data-attribute')).toEqual('my-attribute')
        expect($tabPanelItems.attr('data-attribute-2')).toEqual('my-attribute-2')
      })
    })

    it('renders the first tab selected', () => {
      const $ = render('tabs', {
        items: [
          {
            id: 'tab-1',
            label: 'Tab 1',
            panel: {
              text: 'Panel text'
            }
          },
          {
            id: 'tab-2',
            label: 'Tab 2',
            panel: {
              text: 'Panel text 2'
            }
          }
        ]
      })

      const $tab = $('[href="#tab-1"]').parent()
      expect($tab.hasClass('govuk-tabs__list-item--selected')).toBeTruthy()
    })

    it('hides all but the first panel', () => {
      const $ = render('tabs', {
        items: [
          {
            id: 'tab-1',
            label: 'Tab 1',
            panel: {
              text: 'Panel text'
            }
          },
          {
            id: 'tab-2',
            label: 'Tab 2',
            panel: {
              text: 'Panel text 2'
            }
          }
        ]
      })

      expect($('#tab-2').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
    })
  })
})
