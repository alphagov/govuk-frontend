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
            'data-second-attribute': 'second-value'
          }
        }
      )

      expect(attributes).toEqual(
        ' data-attribute="value" data-second-attribute="second-value"'
      )
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
