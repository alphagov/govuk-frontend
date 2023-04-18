const cheerio = require('cheerio')
const { render } = require('govuk-frontend-helpers/nunjucks')
const { axe } = require('govuk-frontend-helpers/tests')
const { getExamples } = require('govuk-frontend-lib/files')

describe('Hint', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('hint')
  })

  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = cheerio.load(render('hint', examples.default))

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with text', () => {
      const $ = cheerio.load(render('hint', examples.default))

      const content = $('.govuk-hint').text()
      expect(content).toEqual('\n  It\'s on your National Insurance card, benefit letter, payslip or P60.\nFor example, \'QQ 12 34 56 C\'.\n\n')
    })

    it('renders with classes', () => {
      const $ = cheerio.load(render('hint', examples.classes))

      const $component = $('.govuk-hint')
      expect($component.hasClass('app-hint--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = cheerio.load(render('hint', examples.id))

      const $component = $('.govuk-hint')
      expect($component.attr('id')).toEqual('my-hint')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = cheerio.load(render('hint', examples['html as text']))

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('Unexpected &lt;strong&gt;bold text&lt;/strong&gt; in body')
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = cheerio.load(render('hint', examples['with html']))

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('It\'s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.\nFor example, \'QQ 12 34 56 C\'.')
    })

    it('renders with attributes', () => {
      const $ = cheerio.load(render('hint', examples.attributes))

      const $component = $('.govuk-hint')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })
})
