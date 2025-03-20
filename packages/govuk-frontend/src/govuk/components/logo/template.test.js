const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('logo', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('logo')
  })

  describe('SVG logo', () => {
    let $
    let $svg

    beforeAll(() => {
      $ = render('logo', examples.default)
      $svg = $('.govuk-logo')
    })

    it('defaults to Tudor crown', () => {
      expect($svg.attr('viewBox')).toBe('0 0 148 30')
    })

    it('defaults to old logotype', () => {
      const $logotypeDot = $svg.find('.govuk-logo__dot')

      expect($logotypeDot).toHaveLength(0)
    })

    it('sets focusable="false" so that IE does not treat it as an interactive element', () => {
      expect($svg.attr('focusable')).toBe('false')
    })

    it('sets role="img" so that assistive technologies do not treat it as an embedded document', () => {
      expect($svg.attr('role')).toBe('img')
    })

    it('sets aria-label so that assistive technologies have an accessible name to fall back to', () => {
      expect($svg.attr('aria-label')).toBe('GOV.UK')
    })

    it('has an embedded <title> element to serve as alternative text', () => {
      expect($svg.html()).toContain('<title>GOV.UK</title>')
    })

    describe('custom options', () => {
      it('renders attributes correctly', () => {
        const $ = render('logo', examples.attributes)

        const $svg = $('.govuk-logo')
        expect($svg.attr('data-test-attribute')).toBe('value')
        expect($svg.attr('data-test-attribute-2')).toBe('value-2')
      })

      it('renders classes', () => {
        const $ = render('logo', examples.classes)

        const $svg = $('.govuk-logo')
        expect($svg.hasClass('app-logo--custom-modifier')).toBeTruthy()
      })

      describe('if `useLogotype` is false', () => {
        beforeAll(() => {
          $ = render('logo', examples['crown only'])
          $svg = $('.govuk-logo')
        })

        it('reduces the viewBox width', () => {
          expect($svg.attr('viewBox')).toBe('0 0 32 30')
        })

        it('reduces the image width', () => {
          expect($svg.attr('width')).toBe('32')
        })

        it('does not render the logotype element', () => {
          const $crown = $svg.find('.govuk-logo__crown')
          const $logotype = $svg.find('.govuk-logo__logotype')

          expect($crown).toHaveLength(1)
          expect($logotype).toHaveLength(0)
        })
      })
    })

    describe("St. Edward's Crown", () => {
      it("uses the St Edward's Crown if `useTudorCrown` is false", () => {
        $ = render('logo', examples["with St Edward's crown"])
        $svg = $('.govuk-logo')

        expect($svg.attr('viewBox')).toBe('0 0 152 30')
      })
    })

    describe('Dot logotype', () => {
      beforeAll(() => {
        $ = render('logo', examples['with new logotype'])
        $svg = $('.govuk-logo')
      })

      it('uses the Dot Logotype if `rebrand` is true', () => {
        const $logotypeDot = $svg.find('.govuk-logo__dot')

        expect($logotypeDot).toHaveLength(1)
      })

      it('forces use of the Tudor Crown if `rebrand` is true', () => {
        expect($svg.attr('viewBox')).toBe('0 0 163 30')
      })
    })
  })
})
