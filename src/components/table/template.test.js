/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('table')

describe('Table', () => {
  it('passes basic accessibility tests', async () => {
    const $ = render('table', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('allows you to pass additional classes on the table', () => {
    const $ = render('table', {
      classes: 'custom-class-goes-here'
    })

    expect($('.govuk-table').hasClass('custom-class-goes-here')).toBeTruthy()
  })

  it('allows you to specify attributes for the table', () => {
    const $ = render('table', {
      attributes: {
        'data-foo': 'bar'
      }
    })

    expect($('.govuk-table').attr('data-foo')).toEqual('bar')
  })

  // =========================================================
  // Captions
  // =========================================================

  it('allows caption text', () => {
    const $ = render('table', examples['table with head and caption'])
    const $caption = $('.govuk-table__caption')

    expect($caption.text()).toBe('Caption 1: Months and rates')
  })

  it('allows you to pass additional classes for the caption', () => {
    const $ = render('table', examples['table with head and caption'])
    const $caption = $('.govuk-table__caption')

    expect($caption.hasClass('govuk-heading-m')).toBeTruthy()
  })

  // =========================================================
  // Column headers
  // =========================================================

  it('allows you to specify column headers', () => {
    const args = examples['table with head']
    const $ = render('table', args)

    const headings = $('.govuk-table').find('thead tr th')
      .map((_, e) => $(e).text())
      .get()

    expect(headings).toEqual([
      'Month you apply',
      'Rate for bicycles',
      'Rate for vehicles'
    ])
  })

  it('escapes HTML in column headers when passed as text', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo <script>hacking.do(1337)</script>'
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.text()).toEqual('Foo <script>hacking.do(1337)</script>')
  })

  it('allows HTML in column headers when passed as HTML', () => {
    const $ = render('table', {
      head: [
        {
          html: 'Foo <span>bar</span>'
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.text()).toEqual('Foo bar')
  })

  it('allows you to specify the format of column headers', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo',
          format: 'numeric'
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.hasClass('govuk-table__header--numeric')).toBeTruthy()
  })

  it('allows you to pass additional classes for column headers', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo',
          classes: 'my-custom-class'
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.hasClass('my-custom-class')).toBeTruthy()
  })

  it('allows you to specify the rowspan for column headers', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo',
          rowspan: 2
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.attr('rowspan')).toEqual('2')
  })

  it('allows you to specify the colspan for column headers', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo',
          colspan: 2
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.attr('colspan')).toEqual('2')
  })

  it('allows you to specify additional attributes for column headers', () => {
    const $ = render('table', {
      head: [
        {
          text: 'Foo',
          attributes: {
            'data-fizz': 'buzz'
          }
        }
      ]
    })

    const $th = $('.govuk-table thead tr th')

    expect($th.attr('data-fizz')).toEqual('buzz')
  })

  // =========================================================
  // Row headers
  // =========================================================

  describe('when firstCellIsHeader is false', () => {
    it('does not include row headers', () => {
      const $ = render('table', {
        rows: [
          [
            { text: 'Apples' },
            { text: 'green' }
          ],
          [
            { text: 'Strawberries' },
            { text: 'red' }
          ],
          [
            { text: 'Bananas' },
            { text: 'yellow' }
          ]
        ]
      })

      const cells = $('.govuk-table').find('tbody tr td')
        .map((_, e) => $(e).text())
        .get()

      expect(cells).toEqual(
        ['Apples', 'green', 'Strawberries', 'red', 'Bananas', 'yellow']
      )
    })
  })

  describe('when firstCellIsHeader is true', () => {
    it('includes row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Apples' },
            { text: 'green' }
          ],
          [
            { text: 'Strawberries' },
            { text: 'red' }
          ],
          [
            { text: 'Bananas' },
            { text: 'yellow' }
          ]
        ]
      })

      const headings = $('.govuk-table').find('tbody tr th')
        .map((_, e) => $(e).text())
        .get()

      expect(headings).toEqual(['Apples', 'Strawberries', 'Bananas'])
    })

    it('escapes HTML in row headers when passed as text', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo <script>hacking.do(1337)</script>' }
          ]
        ]
      })

      const $th = $('.govuk-table tbody tr th')

      expect($th.text()).toEqual('Foo <script>hacking.do(1337)</script>')
    })

    it('allows HTML in row headers when passed as HTML', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { html: 'Foo <span>bar</span>' }
          ]
        ]
      })

      const $th = $('.govuk-table tbody tr th')

      expect($th.text()).toEqual('Foo bar')
    })

    it('associates row headers with their rows using scope="row"', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo' },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.attr('scope')).toEqual('row')
    })

    it('applies the govuk-table__header class to the row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo' },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.hasClass('govuk-table__header')).toBeTruthy()
    })

    it('allows you to specify additional classes for the row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo', classes: 'my-custom-class' },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.hasClass('my-custom-class')).toBeTruthy()
    })

    it('allows you to specify the rowspan for the row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo', rowspan: 2 },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.attr('rowspan')).toEqual('2')
    })

    it('allows you to specify the colspan for the row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo', colspan: 2 },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.attr('colspan')).toEqual('2')
    })

    it('allows you to specify attributes for the row headers', () => {
      const $ = render('table', {
        firstCellIsHeader: true,
        rows: [
          [
            { text: 'Foo', attributes: { 'data-fizz': 'buzz' } },
            { text: 'bar' }
          ]
        ]
      })

      const $th = $('.govuk-table').find('tbody tr th')

      expect($th.attr('data-fizz')).toEqual('buzz')
    })
  })

  // =========================================================
  // Cells
  // =========================================================

  it('allows you to specify table cells', () => {
    const $ = render('table', {
      rows: [
        [{ text: 'A' }, { text: '1' }],
        [{ text: 'B' }, { text: '2' }],
        [{ text: 'C' }, { text: '3' }]
      ]
    })

    const cells = $('.govuk-table').find('tbody tr')
      .map((_, tr) => {
        return [$(tr).find('td').map((_, td) => $(td).text()).get()]
      })
      .get()

    expect(cells).toEqual([
      ['A', '1'],
      ['B', '2'],
      ['C', '3']
    ])
  })

  it('escapes HTML in cells when passed as text', () => {
    const $ = render('table', {
      rows: [
        [
          { text: 'Foo <script>hacking.do(1337)</script>' }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.text()).toEqual('Foo <script>hacking.do(1337)</script>')
  })

  it('allows HTML in cells when passed as HTML', () => {
    const $ = render('table', {
      rows: [
        [
          { html: 'Foo <span>bar</span>' }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.text()).toEqual('Foo bar')
  })

  it('allows you to specify the format of cells', () => {
    const $ = render('table', {
      rows: [
        [
          {
            text: 'Foo',
            format: 'numeric'
          }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.hasClass('govuk-table__cell--numeric')).toBeTruthy()
  })

  it('allows you to pass additional classes for cells', () => {
    const $ = render('table', {
      rows: [
        [
          {
            text: 'Foo',
            classes: 'my-custom-class'
          }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.hasClass('my-custom-class')).toBeTruthy()
  })

  it('allows you to specify the rowspan for cells', () => {
    const $ = render('table', {
      rows: [
        [
          {
            text: 'Foo',
            rowspan: 2
          }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.attr('rowspan')).toEqual('2')
  })

  it('allows you to specify the colspan for cells', () => {
    const $ = render('table', {
      rows: [
        [
          {
            text: 'Foo',
            colspan: 2
          }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.attr('colspan')).toEqual('2')
  })

  it('allows you to specify additional attributes for cells', () => {
    const $ = render('table', {
      rows: [
        [
          {
            text: 'Foo',
            attributes: {
              'data-fizz': 'buzz'
            }
          }
        ]
      ]
    })

    const $td = $('.govuk-table td')

    expect($td.attr('data-fizz')).toEqual('buzz')
  })
})
