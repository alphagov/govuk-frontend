const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Table', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('table')
  })

  describe('custom options', () => {
    it('sets custom classes', () => {
      document.body.innerHTML = render('table', examples.classes)

      const $component = document.querySelector('.govuk-table')

      expect($component).toHaveClass('custom-class-goes-here')
    })

    it('sets custom attributes', () => {
      document.body.innerHTML = render('table', examples.attributes)

      const $component = document.querySelector('.govuk-table')

      expect($component).toHaveAttribute('data-foo', 'bar')
    })
  })

  describe('cells', () => {
    it('can be specified', () => {
      document.body.innerHTML = render('table', examples.default)

      const $rows = document.querySelectorAll('.govuk-table tbody tr')
      const cells = Array.from($rows).map(($tr) =>
        Array.from($tr.querySelectorAll('td')).map(($td) =>
          $td.textContent.trim()
        )
      )

      expect(cells).toEqual([
        ['January', '£85', '£95'],
        ['February', '£75', '£55'],
        ['March', '£165', '£125']
      ])
    })

    it('can be skipped when falsy', () => {
      document.body.innerHTML = render('table', examples['with falsy items'])

      const $rows = document.querySelectorAll('.govuk-table tbody tr')
      const cells = Array.from($rows).map(($tr) =>
        Array.from($tr.querySelectorAll('td')).map(($td) =>
          $td.textContent.trim()
        )
      )

      expect(cells).toEqual([
        ['A', '1'],
        ['B', '2'],
        ['C', '3']
      ])
    })

    it('renders each cell with the `govuk-table__cell` class', () => {
      document.body.innerHTML = render('table', examples.default)

      const $tdBody = document.querySelectorAll('.govuk-table tbody tr td')

      $tdBody.values().forEach(($td) => {
        expect($td).toHaveClass('govuk-table__cell')
      })
    })

    it('can have a format specified', () => {
      document.body.innerHTML = render('table', examples.default)

      const $tdBody = document.querySelectorAll('.govuk-table tbody tr td')

      expect($tdBody[1]).toHaveClass('govuk-table__cell--numeric')
    })

    it('can have a `rowspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['rows with rowspan and colspan']
      )

      const $td = document.querySelector('.govuk-table tbody tr td')

      expect($td).toHaveAttribute('rowspan', '2')
    })

    it('can have a `colspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['rows with rowspan and colspan']
      )

      const $td = document.querySelector('.govuk-table tbody tr td')

      expect($td).toHaveAttribute('colspan', '2')
    })

    it('can have custom classes', () => {
      document.body.innerHTML = render('table', examples['rows with classes'])

      const $td = document.querySelector('.govuk-table tbody tr td')

      expect($td).toHaveClass('my-custom-class')
    })

    it('can have custom attributes', () => {
      document.body.innerHTML = render(
        'table',
        examples['rows with attributes']
      )

      const $td = document.querySelector('.govuk-table tbody tr td')

      expect($td).toHaveAttribute('data-fizz', 'buzz')
    })
  })

  describe('caption', () => {
    let $caption

    beforeAll(() => {
      document.body.innerHTML = render(
        'table',
        examples['with head, foot and caption']
      )

      $caption = document.querySelector('.govuk-table__caption')
    })

    it('can be specified', () => {
      expect($caption).not.toBeNull()
      expect($caption).toHaveTextContent('Caption 1: Months and rates')
    })

    it('can have additional classes', () => {
      expect($caption).toHaveClass('govuk-table__caption--m')
    })
  })

  describe('header row', () => {
    let $headers

    beforeAll(() => {
      document.body.innerHTML = render('table', examples['with head'])

      $headers = document.querySelectorAll('.govuk-table thead tr th')
    })

    it('can be specified', () => {
      const headers = Array.from($headers).map(($th) => $th.textContent.trim())

      expect(headers).toEqual([
        'Month you apply',
        'Rate for bicycles',
        'Rate for vehicles'
      ])
    })

    it('renders each cell with `scope="col"`', () => {
      $headers.values().forEach(($th) => {
        expect($th).toHaveAttribute('scope', 'col')
      })
    })

    it('renders each cell with the `govuk-table__header` class', () => {
      $headers.values().forEach(($th) => {
        expect($th).toHaveClass('govuk-table__header')
      })
    })

    it('can have a format specified', () => {
      document.body.innerHTML = render('table', examples['with head'])

      const $headers = document.querySelectorAll('.govuk-table thead tr th')

      expect($headers[1]).toHaveClass('govuk-table__header--numeric')
    })

    it('can have a `rowspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['head with rowspan and colspan']
      )

      const $th = document.querySelector('.govuk-table thead tr th')

      expect($th).toHaveAttribute('rowspan', '2')
    })

    it('can have a `colspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['head with rowspan and colspan']
      )

      const $th = document.querySelector('.govuk-table thead tr th')

      expect($th).toHaveAttribute('colspan', '2')
    })

    it('can have custom classes', () => {
      document.body.innerHTML = render('table', examples['head with classes'])

      const $th = document.querySelector('.govuk-table thead tr th')

      expect($th).toHaveClass('my-custom-class')
    })

    it('can have custom attributes', () => {
      document.body.innerHTML = render(
        'table',
        examples['head with attributes']
      )

      const $th = document.querySelector('.govuk-table thead tr th')

      expect($th).toHaveAttribute('data-fizz', 'buzz')
    })
  })

  describe('footer row', () => {
    it('can be specified', () => {
      document.body.innerHTML = render('table', examples['with foot'])

      const footers = Array.from(
        document.querySelectorAll('.govuk-table tfoot tr td')
      ).map(($td) => $td.textContent.trim())

      expect(footers).toEqual(['Total', '£325', '£275'])
    })

    it('can have a format specified', () => {
      document.body.innerHTML = render('table', examples['with foot'])

      const $footers = document.querySelectorAll('.govuk-table tfoot tr td')

      expect($footers[1]).toHaveClass('govuk-table__cell--numeric')
    })

    it('can have custom classes', () => {
      document.body.innerHTML = render('table', examples['foot with classes'])

      const $td = document.querySelector('.govuk-table tfoot tr td')

      expect($td).toHaveClass('my-custom-class')
    })

    it('can have a `rowspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['foot with rowspan and colspan']
      )

      const $td = document.querySelector('.govuk-table tfoot tr td')

      expect($td).toHaveAttribute('rowspan', '2')
    })

    it('can have a `colspan`', () => {
      document.body.innerHTML = render(
        'table',
        examples['foot with rowspan and colspan']
      )

      const $td = document.querySelector('.govuk-table tfoot tr td')

      expect($td).toHaveAttribute('colspan', '2')
    })

    it('can have custom attributes', () => {
      document.body.innerHTML = render(
        'table',
        examples['foot with attributes']
      )

      const $td = document.querySelector('.govuk-table tfoot tr td')

      expect($td).toHaveAttribute('data-fizz', 'buzz')
    })
  })

  describe('row headers', () => {
    describe('when firstCellIsHeader is false', () => {
      let $tdBody
      let $tdFoot

      beforeAll(() => {
        document.body.innerHTML = render(
          'table',
          examples['with head and foot']
        )

        $tdBody = document.querySelectorAll('.govuk-table tbody tr td')
        $tdFoot = document.querySelectorAll('.govuk-table tfoot tr td')
      })

      it('does not add row headers to tbody', () => {
        const cells = Array.from($tdBody).map(($td) => $td.textContent.trim())

        expect(cells).toEqual([
          'January',
          '£85',
          '£95',
          'February',
          '£75',
          '£55',
          'March',
          '£165',
          '£125'
        ])
      })

      it('does not add row headers to tfoot', () => {
        const cells = Array.from($tdFoot).map(($td) => $td.textContent.trim())

        expect(cells).toEqual(['Total', '£325', '£275'])
      })
    })

    describe('when firstCellIsHeader is true', () => {
      let $thBody
      let $thFoot

      beforeAll(() => {
        document.body.innerHTML = render(
          'table',
          examples['with firstCellIsHeader true']
        )

        $thBody = document.querySelectorAll('.govuk-table tbody tr th')
        $thFoot = document.querySelectorAll('.govuk-table tfoot tr th')
      })

      describe('tbody', () => {
        it('renders the first cell of each row as a `th`', () => {
          const cells = Array.from($thBody).map(($th) => $th.textContent.trim())

          expect(cells).toEqual(['January', 'February', 'March'])
        })

        it('renders the first cell of each row with `scope="row"`', () => {
          $thBody.values().forEach(($th) => {
            expect($th).toHaveAttribute('scope', 'row')
          })
        })

        it('renders the first cell of each row with the `govuk-table__header` class', () => {
          $thBody.values().forEach(($th) => {
            expect($th).toHaveClass('govuk-table__header')
          })
        })

        it('can have `rowspan`', () => {
          document.body.innerHTML = render(
            'table',
            examples['firstCellIsHeader with rowspan and colspan']
          )

          const $th = document.querySelector('.govuk-table tbody tr th')

          expect($th).toHaveAttribute('rowspan', '2')
        })

        it('can have `colspan`', () => {
          document.body.innerHTML = render(
            'table',
            examples['firstCellIsHeader with rowspan and colspan']
          )

          const $th = document.querySelector('.govuk-table tbody tr th')

          expect($th).toHaveAttribute('colspan', '2')
        })

        it('can have custom attributes', () => {
          document.body.innerHTML = render(
            'table',
            examples['firstCellIsHeader with attributes']
          )

          const $th = document.querySelector('.govuk-table tbody tr th')

          expect($th).toHaveAttribute('data-fizz', 'buzz')
        })
      })

      describe('tfoot', () => {
        it('renders the first cell as a `th`', () => {
          expect($thFoot[0]).toHaveTextContent('Foo')
        })

        it('renders the first cell with `scope="row"`', () => {
          expect($thFoot[0]).toHaveAttribute('scope', 'row')
        })

        it('renders the first cell with the `govuk-table__header` class', () => {
          expect($thFoot[0]).toHaveClass('govuk-table__header')
        })
      })
    })
  })
})
