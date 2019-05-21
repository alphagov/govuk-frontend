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

  it('can have additional classes', () => {
    const $ = render('table', {
      classes: 'custom-class-goes-here'
    })

    expect($('.govuk-table').hasClass('custom-class-goes-here')).toBeTruthy()
  })

  it('can have additional attributes', () => {
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

  describe('captions', () => {
    it('can have custom text', () => {
      const $ = render('table', examples['table with head and caption'])
      const $caption = $('.govuk-table__caption')

      expect($caption.text()).toBe('Caption 1: Months and rates')
    })

    it('can have additional classes', () => {
      const $ = render('table', examples['table with head and caption'])
      const $caption = $('.govuk-table__caption')

      expect($caption.hasClass('govuk-heading-m')).toBeTruthy()
    })
  })

  // =========================================================
  // Column headers
  // =========================================================

  describe('column headers', () => {
    it('can be specified', () => {
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

    it('have HTML escaped when passed as text', () => {
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

    it('allow HTML when passed as HTML', () => {
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

    it('can have a format specified', () => {
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

    it('can have additional classes', () => {
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

    it('can have rowspan specified', () => {
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

    it('can have colspan specified', () => {
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

    it('can have additional attributes', () => {
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
  })

  // =========================================================
  // Row headers
  // =========================================================

  describe('row headers', () => {
    describe('when firstCellIsHeader is false', () => {
      it('are not included', () => {
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
      it('are included', () => {
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

      it('have HTML escaped when passed as text', () => {
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

      it('allow HTML when passed as HTML', () => {
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

      it('are associated with their rows using scope="row"', () => {
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

      it('have the govuk-table__header class', () => {
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

      it('can have additional classes', () => {
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

      it('can have rowspan specified', () => {
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

      it('can have colspan specified', () => {
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

      it('can have additional attributes', () => {
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
  })

  // =========================================================
  // Cells
  // =========================================================

  describe('cells', () => {
    it('can be specified', () => {
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

    it('have HTML escaped when passed as text', () => {
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

    it('allow HTML when passed as HTML', () => {
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

    it('can have a format specified', () => {
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

    it('can have additional classes', () => {
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

    it('can have rowspan specified', () => {
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

    it('can have colspan specified', () => {
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

    it('can have additional attributes', () => {
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
})
