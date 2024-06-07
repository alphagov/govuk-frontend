const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Tag', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('tag')
  })

  describe('default example', () => {
    it('renders the default example with strong element and text', () => {
      const $ = render('tag', examples.default)

      const $component = $('.govuk-tag')
      expect($component.get(0).tagName).toBe('strong')
      expect($component.text()).toContain('Alpha')
    })

    it('renders classes', () => {
      const $ = render('tag', examples.grey)

      const $component = $('.govuk-tag')
      expect($component.hasClass('govuk-tag--grey')).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders custom text', () => {
      const $ = render('tag', examples.grey)

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('Grey')
    })

    it('renders attributes', () => {
      const $ = render('tag', examples.attributes)

      const $component = $('.govuk-tag')
      expect($component.attr('data-test')).toBe('attribute')
      expect($component.attr('id')).toBe('my-tag')
    })
  })

  describe('html', () => {
    it('renders escaped html when passed to text', () => {
      const $ = render('tag', examples['html as text'])

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('&lt;span&gt;Alpha&lt;/span&gt;')
    })

    it('renders html', () => {
      const $ = render('tag', examples.html)

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('<span>Alpha</span>')
    })
  })
})
