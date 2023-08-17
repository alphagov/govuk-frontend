/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      items: [
        {
          label: 'Past day',
          id: 'past-day',
          panel: {
            html:
              '<h2 class="govuk-heading-l">Past day</h2>\n' +
              '<table class="govuk-table">\n' +
              '  <thead class="govuk-table__head">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <th class="govuk-table__header" scope="col">Case manager</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases opened</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases closed</th>\n' +
              '    </tr>\n' +
              '  </thead>\n' +
              '  <tbody class="govuk-table__body">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">David Francis</td>\n' +
              '      <td class="govuk-table__cell">3</td>\n' +
              '      <td class="govuk-table__cell">0</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Paul Farmer</td>\n' +
              '      <td class="govuk-table__cell">1</td>\n' +
              '      <td class="govuk-table__cell">0</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Rita Patel</td>\n' +
              '      <td class="govuk-table__cell">2</td>\n' +
              '      <td class="govuk-table__cell">0</td>\n' +
              '    </tr>\n' +
              '  </tbody>\n' +
              '</table>\n'
          }
        },
        {
          label: 'Past week',
          id: 'past-week',
          panel: {
            html:
              '<h2 class="govuk-heading-l">Past week</h2>\n' +
              '<table class="govuk-table">\n' +
              '  <thead class="govuk-table__head">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <th class="govuk-table__header" scope="col">Case manager</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases opened</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases closed</th>\n' +
              '    </tr>\n' +
              '  </thead>\n' +
              '  <tbody class="govuk-table__body">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">David Francis</td>\n' +
              '      <td class="govuk-table__cell">24</td>\n' +
              '      <td class="govuk-table__cell">18</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Paul Farmer</td>\n' +
              '      <td class="govuk-table__cell">16</td>\n' +
              '      <td class="govuk-table__cell">20</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Rita Patel</td>\n' +
              '      <td class="govuk-table__cell">24</td>\n' +
              '      <td class="govuk-table__cell">27</td>\n' +
              '    </tr>\n' +
              '  </tbody>\n' +
              '</table>\n'
          }
        },
        {
          label: 'Past month',
          id: 'past-month',
          panel: {
            html:
              '<h2 class="govuk-heading-l">Past month</h2>\n' +
              '<table class="govuk-table">\n' +
              '  <thead class="govuk-table__head">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <th class="govuk-table__header" scope="col">Case manager</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases opened</th>\n' +
              '      <th class="govuk-table__header" scope="col">Cases closed</th>\n' +
              '    </tr>\n' +
              '  </thead>\n' +
              '  <tbody class="govuk-table__body">\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">David Francis</td>\n' +
              '      <td class="govuk-table__cell">98</td>\n' +
              '      <td class="govuk-table__cell">95</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Paul Farmer</td>\n' +
              '      <td class="govuk-table__cell">122</td>\n' +
              '      <td class="govuk-table__cell">131</td>\n' +
              '    </tr>\n' +
              '    <tr class="govuk-table__row">\n' +
              '      <td class="govuk-table__cell">Rita Patel</td>\n' +
              '      <td class="govuk-table__cell">126</td>\n' +
              '      <td class="govuk-table__cell">142</td>\n' +
              '    </tr>\n' +
              '  </tbody>\n' +
              '</table>\n'
          }
        },
        {
          label: 'Past year',
          id: 'past-year',
          panel: {
            text: 'There is no data for this year yet, check back later'
          }
        }
      ]
    }
  },
  {
    name: 'tabs-with-anchor-in-panel',
    description: 'Ensure that anchors that are in tab panels work correctly',
    options: {
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            html:
              '<h2 class="govuk-heading-l">Tab 1</h2>\n' +
              '<p class="govuk-body">Testing that when you click the anchor it moves to the anchor point successfully</p>\n' +
              '<p class="govuk-body"><a class="govuk-link" href="#anchor">Anchor</a></p>\n' +
              '<p class="govuk-body"><a id="anchor" tabindex="0">Anchor Point</a></p>\n'
          }
        },
        {
          label: 'Tab 2',
          id: 'tab-2',
          panel: {
            html: '<h2 class="govuk-heading-l">Tab 2</h2>\n'
          }
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'app-tabs--custom-modifier',
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: 'Information about tabs'
          }
        }
      ]
    }
  },
  {
    name: 'id',
    hidden: true,
    options: {
      id: 'my-tabs',
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: 'Information about tabs'
          }
        }
      ]
    }
  },
  {
    name: 'title',
    hidden: true,
    options: {
      title: 'Custom title for Contents',
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: 'Information about tabs'
          }
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      attributes: {
        'data-attribute': 'my data value'
      },
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: 'Information about tabs'
          }
        }
      ]
    }
  },
  {
    name: 'item with attributes',
    hidden: true,
    options: {
      items: [
        {
          id: 'tab-1',
          label: 'Tab 1',
          panel: {
            text: 'Information about tabs'
          },
          attributes: {
            'data-attribute': 'my-attribute',
            'data-attribute-2': 'my-attribute-2'
          }
        }
      ]
    }
  },
  {
    name: 'panel with attributes',
    hidden: true,
    options: {
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
    }
  },
  {
    name: 'no item list',
    hidden: true,
    options: {
      id: 'my-tabs',
      classes: 'app-tabs--custom-modifier'
    }
  },
  {
    name: 'empty item list',
    hidden: true,
    options: {
      items: []
    }
  },
  {
    name: 'with falsey values',
    hidden: true,
    options: {
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: 'Panel 1 content'
          }
        },
        null,
        false,
        '',
        {
          label: 'Tab 2',
          id: 'tab-2',
          panel: {
            text: 'Panel 2 content'
          }
        }
      ]
    }
  },
  {
    name: 'idPrefix',
    hidden: true,
    options: {
      idPrefix: 'custom',
      items: [
        {
          label: 'Tab 1',
          panel: {
            text: 'Panel 1 content'
          }
        },
        {
          label: 'Tab 2',
          panel: {
            text: 'Panel 2 content'
          }
        }
      ]
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            text: '<p>Panel 1 content</p>'
          }
        },
        {
          label: 'Tab 2',
          id: 'tab-2',
          panel: {
            text: '<p>Panel 2 content</p>'
          }
        }
      ]
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      items: [
        {
          label: 'Tab 1',
          id: 'tab-1',
          panel: {
            html: '<p>Panel 1 content</p>'
          }
        },
        {
          label: 'Tab 2',
          id: 'tab-2',
          panel: {
            html: '<p>Panel 2 content</p>'
          }
        }
      ]
    }
  }
]
