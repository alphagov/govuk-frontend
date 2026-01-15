const { renderMacro } = require('@govuk-frontend/lib/components')

describe('logo.njk', () => {
  describe('with default nunjucks configuration', () => {
    let $svg

    beforeAll(() => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {}
      )
      $svg = document.querySelector('svg')
    })

    it('displays Tudor crown', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 324 60')
    })

    it('displays logotype', () => {
      const $logotypeDot = $svg.querySelector('g ~ circle')

      expect($logotypeDot).not.toBeNull()
      expect($logotypeDot).toHaveClass('govuk-logo-dot')
    })

    it('sets `focusable="false"` so that IE does not treat it as an interactive element', () => {
      expect($svg).toHaveAttribute('focusable', 'false')
    })

    it('sets `role="presentation"` so that assistive technologies do not treat it as an embedded document', () => {
      expect($svg).toHaveAttribute('role', 'presentation')
    })

    it('sets `fill="currentColor"` so that forced colors are respected', () => {
      expect($svg).toHaveAttribute('fill', 'currentcolor')
    })
  })

  describe('custom options', () => {
    it('renders attributes correctly', () => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            attributes: {
              'data-test-attribute': 'value',
              'data-test-attribute-2': 'value-2'
            }
          }
        }
      )

      const $svg = document.querySelector('svg')
      expect($svg).toHaveAttribute('data-test-attribute', 'value')
      expect($svg).toHaveAttribute('data-test-attribute-2', 'value-2')
    })

    it('renders classes correctly', () => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            classes: 'app-logo--custom-modifier'
          }
        }
      )

      const $svg = document.querySelector('svg')
      expect($svg.classList).toContain('app-logo--custom-modifier')
    })

    describe('if `ariaLabelText` is set', () => {
      let $svg

      beforeAll(() => {
        document.body.innerHTML = renderMacro(
          'govukLogo',
          './govuk/macros/logo.njk',
          {
            context: {
              ariaLabelText: 'test string'
            }
          }
        )
        $svg = document.querySelector('svg')
      })

      it('renders `aria-label` and `<title>`', () => {
        expect($svg).toHaveAttribute('aria-label', 'test string')
        expect($svg.innerHTML).toContain('<title>test string</title>')
      })

      it('changes the `role` to `img`', () => {
        expect($svg).toHaveAttribute('role', 'img')
      })
    })
  })

  describe('if `useLogotype` is false', () => {
    let $svg

    beforeAll(() => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            useLogotype: false
          }
        }
      )
      $svg = document.querySelector('svg')
    })

    it('reduces the `viewBox` width', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 64 60')
    })

    it('reduces the image width', () => {
      expect($svg).toHaveAttribute('width', '32')
    })

    it('does not render the logotype element', () => {
      const $crown = $svg.querySelector('g')
      const $logotype = $svg.querySelector('g + path')

      expect($crown).not.toBeNull()
      expect($logotype).toBeNull()
    })
  })
})
