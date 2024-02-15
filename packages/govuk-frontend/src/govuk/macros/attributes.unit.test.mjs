import { renderMacro } from '@govuk-frontend/lib/components'

describe('attributes.njk', () => {
  describe('govukAttributes', () => {
    it('renders a single attribute', () => {
      const attributes = renderMacro(
        'govukAttributes',
        'govuk/macros/attributes.njk',
        {
          context: {
            'data-attribute': 'value'
          }
        }
      )

      // Note the starting space so we ensure it doesn't stick to possible other previous attributes
      expect(attributes).toEqual(' data-attribute="value"')
    })

    it('renders multiple attributes', () => {
      const attributes = renderMacro(
        'govukAttributes',
        'govuk/macros/attributes.njk',
        {
          context: {
            'data-attribute': 'value',
            'data-second-attribute': 'second-value',
            'data-third-attribute': {
              type: 'string',
              value: 'third-value'
            }
          }
        }
      )

      expect(attributes).toEqual(
        ' data-attribute="value" data-second-attribute="second-value" data-third-attribute="third-value"'
      )
    })

    it('renders attribute values as strings by default', () => {
      const attributes = renderMacro(
        'govukAttributes',
        'govuk/macros/attributes.njk',
        {
          context: {
            viewBox: '0 0 15 13',
            focusable: false,
            'aria-hidden': true
          }
        }
      )

      // Note that `aria-hidden` and `focusable` are not converted to boolean attributes
      expect(attributes).toEqual(
        ' viewBox="0 0 15 13" focusable="false" aria-hidden="true"'
      )
    })

    it('outputs attributes if already stringified', () => {
      const attributes = renderMacro(
        'govukAttributes',
        'govuk/macros/attributes.njk',
        {
          context: ' data-attribute="value"'
        }
      )

      expect(attributes).toEqual(' data-attribute="value"')
    })

    it('outputs nothing if there are no attributes', () => {
      const attributes = renderMacro(
        'govukAttributes',
        'govuk/macros/attributes.njk',
        {
          context: {}
        }
      )

      expect(attributes).toEqual('')
    })
  })
})
