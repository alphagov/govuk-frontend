const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Hint', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('hint')
  })

  describe('by default', () => {
    it('renders with text', () => {
      const $ = render('hint', examples.default)

      const content = $('.govuk-hint').text()
      expect(content).toEqual(
        "\n  It's on your National Insurance card, benefit letter, payslip or P60.\nFor example, 'QQ 12 34 56 C'.\n\n"
      )
    })

    it('renders with classes', () => {
      const $ = render('hint', examples.classes)

      const $component = $('.govuk-hint')
      expect($component.hasClass('app-hint--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('hint', examples.id)

      const $component = $('.govuk-hint')
      expect($component.attr('id')).toEqual('my-hint')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('hint', examples['html as text'])

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual(
        'Unexpected &lt;strong&gt;bold text&lt;/strong&gt; in body'
      )
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = render('hint', examples['with html'])

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual(
        'It\'s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.\nFor example, \'QQ 12 34 56 C\'.'
      )
    })

    it('renders with attributes', () => {
      const $ = render('hint', examples.attributes)

      const $component = $('.govuk-hint')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })
})
