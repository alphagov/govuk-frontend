const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Inset text', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('inset-text')
  })

  describe('by default', () => {
    it('renders with classes', () => {
      const $ = render('inset-text', examples.classes)

      const $component = $('.govuk-inset-text')
      expect(
        $component.hasClass('app-inset-text--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('inset-text', examples.id)

      const $component = $('.govuk-inset-text')
      expect($component.attr('id')).toEqual('my-inset-text')
    })

    it('renders nested components using `call`', () => {
      const $ = render('inset-text', {
        callBlock: '<div class="app-nested-component"></div>'
      })

      expect($('.govuk-inset-text .app-nested-component').length).toBeTruthy()
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('inset-text', examples['html as text'])

      const content = $('.govuk-inset-text').html().trim()
      expect(content).toEqual(
        'It can take &lt;b&gt;up to 8 weeks&lt;/b&gt; to register a lasting power of attorney if there are no mistakes in the application.'
      )
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = render('inset-text', examples['with html'])

      const mainContent = $('.govuk-inset-text .govuk-body:first-child')
        .text()
        .trim()
      const warningContent = $('.govuk-inset-text .govuk-warning-text__text')
        .text()
        .trim()
      expect(mainContent).toEqual(
        'It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.'
      )
      expect(warningContent).toEqual(
        'Warning\n    You can be fined up to £5,000 if you don’t register.'
      )
    })

    it('renders with attributes', () => {
      const $ = render('inset-text', examples.attributes)

      const $component = $('.govuk-inset-text')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })
})
