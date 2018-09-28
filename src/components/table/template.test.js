/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('table')

describe('Table', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('table', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders with classes', () => {
    const $ = render('table', {
      'classes': 'custom-class-goes-here',
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric'
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')

    expect($component.hasClass('custom-class-goes-here')).toBeTruthy()
  })

  it('renders with caption text', () => {
    const $ = render('table', examples['table with head and caption'])
    const $caption = $('.govuk-table__caption')

    expect($caption.text()).toBe('Caption 1: Months and rates')
  })

  it('renders the caption size class', () => {
    const $ = render('table', examples['table with head and caption'])
    const $caption = $('.govuk-table__caption')

    expect($caption.hasClass('govuk-heading-m')).toBeTruthy()
  })

  it('renders first cell in every row as a <th> element with correct `govuk-table__header` class and `scope=row` attribute', () => {
    const $ = render('table', {
      'firstCellIsHeader': true,
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric'
          },
          {
            'text': '£95',
            'format': 'numeric'
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£75',
            'format': 'numeric'
          },
          {
            'text': '£55',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableBody = $component.find('.govuk-table .govuk-table__body')
    const $firstTableRow = $tableBody.find('.govuk-table__row:first-child')
    const $firstTableHeader = $firstTableRow.find('.govuk-table__header:first-child')

    expect($firstTableHeader.get(0).tagName).toEqual('th')
    expect($firstTableHeader.attr('scope')).toEqual('row')
    expect($firstTableHeader.hasClass('govuk-table__header')).toBeTruthy()

    const $lastTableRow = $tableBody.find('.govuk-table__row:last-child')
    const $lastTableHeader = $lastTableRow.find('.govuk-table__header:first-child')

    expect($lastTableHeader.get(0).tagName).toEqual('th')
    expect($lastTableHeader.attr('scope')).toEqual('row')
    expect($lastTableHeader.hasClass('govuk-table__header')).toBeTruthy()
  })

  it('renders with thead', () => {
    const args = examples['table with head']
    const $ = render('table', args)

    const $component = $('.govuk-table')
    const $tableHead = $component.find('.govuk-table__head')
    const $tableHeadRow = $tableHead.find('.govuk-table__row')
    const $tableHeadCell = $tableHeadRow.find('.govuk-table__header')

    expect($tableHead).toHaveLength(1)
    expect($tableHeadRow).toHaveLength(1)
    expect($tableHeadCell).toHaveLength(3)
  })

  it('renders table header cell `format` attribute correctly', () => {
    const $ = render('table', {
      'head': [
        {
          'text': 'Month you apply'
        },
        {
          'text': 'Rate for bicycles',
          'format': 'numeric'
        },
        {
          'text': 'Rate for vehicles',
          'format': 'numeric'
        }
      ],
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric'
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })

    const $component = $('.govuk-table')
    const $tableHeadCell = $component.find('.govuk-table__head .govuk-table__header')

    expect($tableHeadCell.eq(1).attr('class')).toMatch('govuk-table__header--numeric')
  })

  it('renders optional classes for the table header cell correctly', () => {
    const $ = render('table', {
      'head': [
        {
          'text': 'Rate for bicycles',
          'classes': 'extra-class'
        }
      ],
      'rows': [
        [
          {
            'text': 'January'
          }
        ]
      ]
    })

    const $component = $('.govuk-table')
    const $tableHeadCell = $component.find('.govuk-table__head .govuk-table__header:first-child')

    expect($tableHeadCell.hasClass('extra-class')).toBeTruthy()
  })

  describe('rows and cells', () => {
    const $ = render('table', examples.default)
    const $component = $('.govuk-table')
    const $tableBody = $component.find('.govuk-table__body')
    const $tableRow = $component.find('.govuk-table__row')
    const $tableCell = $component.find('.govuk-table__cell')

    it('renders one tbody element', () => {
      expect($tableBody).toHaveLength(1)
    })

    it('renders the specified number of rows', () => {
      expect($tableRow).toHaveLength(3)
    })

    it('renders the specified number of cells in row 1', () => {
      expect($tableRow.eq(0).find($tableCell)).toHaveLength(3)
    })

    it('renders the specified number of cells in row 2', () => {
      expect($tableRow.eq(1).find($tableCell)).toHaveLength(3)
    })

    it('renders the specified number of cells in row 3', () => {
      expect($tableRow.eq(2).find($tableCell)).toHaveLength(3)
    })

    it('renders correct text in cell 1 of row 1', () => {
      expect($tableRow.eq(0).find($tableCell).eq(0).text()).toEqual('January')
    })

    it('renders correct text in cell 2 of row 1', () => {
      expect($tableRow.eq(0).find($tableCell).eq(1).text()).toEqual('£85')
    })

    it('renders correct text in cell 3 of row 1', () => {
      expect($tableRow.eq(0).find($tableCell).eq(2).text()).toEqual('£95')
    })
  })

  it('renders cell with html', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'html': '<em>85</em>',
            'format': 'numeric'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })

    const $component = $('.govuk-table')
    const $tableBody = $component.find('.govuk-table__body')
    const $tableRow = $tableBody.find('.govuk-table__row')
    const $tableCell = $tableRow.find('.govuk-table__cell')

    expect($tableCell.eq(1).html()).toEqual('<em>85</em>')
  })

  it('renders cell escaped html in text', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '<em>85</em>',
            'format': 'numeric'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableBody = $component.find('.govuk-table__body')
    const $tableRow = $tableBody.find('.govuk-table__row')
    const $tableCell = $tableRow.find('.govuk-table__cell')

    expect($tableCell.eq(1).html()).toEqual('&lt;em&gt;85&lt;/em&gt;')
  })

  it('renders cell `format` attribute correctly', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric'
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableCell = $component.find('.govuk-table__body .govuk-table__cell')

    expect($tableCell.eq(1).attr('class')).toMatch('govuk-table__cell--numeric')
  })

  it('renders cell‘s optional classes correctly', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': '£85',
            'classes': 'extra-cell-class'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableCell = $component.find('.govuk-table__body .govuk-table__cell:first-child')

    expect($tableCell.hasClass('extra-cell-class')).toBeTruthy()
  })

  it('renders cell `colspan` attribute correctly', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric',
            'colspan': 2
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableCell = $component.find('.govuk-table__body .govuk-table__row .govuk-table__cell')

    expect($tableCell.eq(1).attr('colspan')).toEqual('2')
  })

  it('renders cell `rowspan` attribute correctly', () => {
    const $ = render('table', {
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric',
            'rowspan': 2
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })
    const $component = $('.govuk-table')
    const $tableCell = $component.find('.govuk-table__body .govuk-table__row .govuk-table__cell')

    expect($tableCell.eq(1).attr('rowspan')).toEqual('2')
  })

  it('renders with attributes', () => {
    const $ = render('table', {
      'attributes': {
        'attribute-1': 'yes',
        'attribute-2': 'no'
      },
      'rows': [
        [
          {
            'text': 'January'
          },
          {
            'text': '£85',
            'format': 'numeric'
          }
        ],
        [
          {
            'text': 'February'
          },
          {
            'text': '£165',
            'format': 'numeric'
          }
        ]
      ]
    })

    const $component = $('.govuk-table')

    expect($component.attr('attribute-1')).toEqual('yes')
    expect($component.attr('attribute-2')).toEqual('no')
  })
})
