import { renderMacro } from 'govuk-frontend-helpers/nunjucks'

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

    it('defaults to St Edwards crown', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 132 97')
      expect($svg).toHaveAttribute('width', '36')
    })

    it('only renders the default crown path', () => {
      // The St Edward's crown is just a flat path whilst the tudor crown and
      // rebranded logo use an svg group (`g` tag) for the crown and a path for
      // the logotype
      const $stEdsCrown = $svg.querySelector('path')
      const $crownGroup = $svg.querySelector('g')
      const $logotype = $svg.querySelector('g + path')

      expect($stEdsCrown).not.toBeNull()
      expect($crownGroup).toBeNull()
      expect($logotype).toBeNull()
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

  describe('if `useTudorCrown` is true', () => {
    let $svg

    beforeAll(() => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            useTudorCrown: true
          }
        }
      )
      $svg = document.querySelector('svg')
    })

    it('increases the `viewbox` width', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 64 60')
    })

    it('increases the image width', () => {
      expect($svg).toHaveAttribute('width', '32')
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
      $svg = document.querySelector('svg')
    })

    it('uses the logotype', () => {
      const $logotypeDot = $svg.querySelector('g ~ circle')

      expect($logotypeDot).not.toBeNull()
      expect($logotypeDot).toHaveClass('govuk-logo-dot')
    })

    it('forces use of the Tudor Crown if `rebrand` is true', () => {
      expect($svg).toHaveAttribute('viewBox', '0 0 324 60')
    })
  })

  describe('if `useText` is true', () => {
    let $span

    beforeAll(() => {
      document.body.innerHTML = renderMacro(
        'govukLogo',
        './govuk/macros/logo.njk',
        {
          context: {
            useText: {
              text: 'My logo text',
              class: 'my-span-class'
            }
          }
        }
      )
      $span = document.querySelector('svg + span')
    })

    it('renders the logo text', () => {
      expect($span.innerHTML).toContain('My logo text')
    })

    it('applies the class to the span', () => {
      expect($span).toHaveClass('my-span-class')
    })
  })
})
