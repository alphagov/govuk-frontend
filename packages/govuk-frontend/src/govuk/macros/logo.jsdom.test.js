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
      $svg = document.querySelector('.govuk-logo')
    })

    it('defaults to Tudor crown', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 148 30')
    })

    it('defaults to old logotype', () => {
      const $logotypeDot = $svg.querySelector('.govuk-logo__dot')

      expect($logotypeDot).toBeNull()
    })

    it('sets `focusable="false"` so that IE does not treat it as an interactive element', () => {
      expect($svg).toHaveAttribute('focusable', 'false')
    })

    it('sets `role="presentation"` so that assistive technologies do not treat it as an embedded document', () => {
      expect($svg).toHaveAttribute('role', 'presentation')
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

      const $svg = document.querySelector('.govuk-logo')
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

      const $svg = document.querySelector('.govuk-logo')
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
        $svg = document.querySelector('.govuk-logo')
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
      $svg = document.querySelector('.govuk-logo')
    })

    it('reduces the `viewBox` width', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 32 30')
    })

    it('reduces the image width', () => {
      expect($svg).toHaveAttribute('width', '32')
    })

    it('does not render the logotype element', () => {
      const $crown = $svg.querySelector('.govuk-logo__crown')
      const $logotype = $svg.querySelector('.govuk-logo__logotype')

      expect($crown).not.toBeNull()
      expect($logotype).toBeNull()
    })
  })

  describe('if `useTudorCrown` is false', () => {
    it("uses the St Edward's Crown with logotype", () => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            useTudorCrown: false
          }
        }
      )
      const $svg = document.querySelector('.govuk-logo')

      expect($svg).toHaveAttribute('viewBox', '0 0 152 30')
    })
  })

  describe('if `useTudorCrown` and `useLogotype` are false', () => {
    it("uses the St Edward's Crown in isolation", () => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            useTudorCrown: false,
            useLogotype: false
          }
        }
      )
      const $svg = document.querySelector('.govuk-logo')

      expect($svg).toHaveAttribute('viewBox', '0 0 36 30')
    })
  })

  describe('if `rebrand` is true', () => {
    let $svg

    beforeAll(() => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            rebrand: true
          }
        }
      )
      $svg = document.querySelector('.govuk-logo')
    })

    it('uses the Dot logotype if `rebrand` is true', () => {
      const $logotypeDot = $svg.querySelector('.govuk-logo__dot')

      expect($logotypeDot).not.toBeNull()
    })

    it('forces use of the Tudor Crown if `rebrand` is true', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 163 30')
    })
  })
})
