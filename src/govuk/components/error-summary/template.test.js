const cheerio = require('cheerio')

const { getExamples } = require('../../../../lib/file-helper')
const { axe } = require('../../../../lib/jest-helpers')
const { render } = require('../../../../lib/nunjucks-helpers')

describe('Error-summary', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('error-summary')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = cheerio.load(render('error-summary', examples.default))

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('has a child container with the role=alert attribute', () => {
      const $ = cheerio.load(render('error-summary', examples.default))
      const childRoleAttr = $('.govuk-error-summary div:first-child').attr('role')

      expect(childRoleAttr).toEqual('alert')
    })

    it('renders title text', () => {
      const $ = cheerio.load(render('error-summary', examples.default))
      const summaryTitle = $('.govuk-error-summary__title').text().trim()

      expect(summaryTitle).toEqual('There is a problem')
    })

    it('number of error items matches the number of items specified', () => {
      const $ = cheerio.load(render('error-summary', examples.default))
      const errorList = $('.govuk-error-summary .govuk-error-summary__list li')

      expect(errorList).toHaveLength(2)
    })

    it('error list item is an anchor tag if href attribute is specified', () => {
      const $ = cheerio.load(render('error-summary', examples.default))

      const errorItem = $('.govuk-error-summary .govuk-error-summary__list li:first-child')
      expect(errorItem.children().get(0).tagName).toEqual('a')
    })

    it('render anchor tag href attribute is correctly', () => {
      const $ = cheerio.load(render('error-summary', examples.default))

      const errorItem = $('.govuk-error-summary .govuk-error-summary__list li:first-child a')
      expect(errorItem.attr('href')).toEqual('#example-error-1')
    })
  })

  describe('custom options', () => {
    it('allows title text to be passed whilst escaping HTML entities', () => {
      const $ = cheerio.load(render('error-summary', examples['html as titleText']))

      const summaryTitle = $('.govuk-error-summary__title').html().trim()
      expect(summaryTitle).toEqual('Alert, &lt;em&gt;alert&lt;/em&gt;')
    })

    it('allows title HTML to be passed un-escaped', () => {
      const $ = cheerio.load(render('error-summary', examples['title html']))

      const summaryTitle = $('.govuk-error-summary__title').html().trim()
      expect(summaryTitle).toEqual('Alert, <em>alert</em>')
    })

    it('renders description text', () => {
      const $ = cheerio.load(render('error-summary', examples.description))
      const summaryDescription = $('.govuk-error-summary__body p').text().trim()

      expect(summaryDescription).toEqual('Lorem ipsum')
    })

    it('allows description text to be passed whilst escaping HTML entities', () => {
      const $ = cheerio.load(render('error-summary', examples['html as descriptionText']))

      const summaryDescription = $('.govuk-error-summary__body p').html().trim()
      expect(summaryDescription).toEqual('See errors below (&gt;)')
    })

    it('allows description HTML to be passed un-escaped', () => {
      const $ = cheerio.load(render('error-summary', examples['description html']))

      const summaryDescription = $('.govuk-error-summary__body p').html().trim()
      expect(summaryDescription).toEqual('See <span>errors</span> below')
    })

    it('renders nested components in description using `call`', () => {
      const $ = cheerio.load(render('error-summary', {}, '<div class="app-nested-component"></div>'))

      expect($('.govuk-error-summary .app-nested-component').length).toBeTruthy()
    })

    it('allows additional classes to be added to the error-summary component', () => {
      const $ = cheerio.load(render('error-summary', examples.classes))

      const $component = $('.govuk-error-summary')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('allows additional attributes to be added to the error-summary component', () => {
      const $ = cheerio.load(render('error-summary', examples.attributes))

      const $component = $('.govuk-error-summary')
      expect($component.attr('first-attribute')).toEqual('foo')
      expect($component.attr('second-attribute')).toEqual('bar')
    })

    it('renders anchor tag with attributes', () => {
      const $ = cheerio.load(render('error-summary', examples['error list with attributes']))

      const $component = $('.govuk-error-summary__list a')
      expect($component.attr('data-attribute')).toEqual('my-attribute')
      expect($component.attr('data-attribute-2')).toEqual('my-attribute-2')
    })

    it('renders error item text', () => {
      const $ = cheerio.load(render('error-summary', examples['without links']))
      const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li:first-child').text().trim()

      expect(errorItemText).toEqual('Invalid username or password')
    })

    it('allows error item HTML to be passed un-escaped', () => {
      const $ = cheerio.load(render('error-summary', examples['error list with html']))

      const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li').html().trim()

      expect(errorItemText).toEqual('The date your passport was issued <b>must</b> be in the past')
    })

    it('allows error item text to be passed whilst escaping HTML entities', () => {
      const $ = cheerio.load(render('error-summary', examples['error list with html as text']))

      const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li').html().trim()

      expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
    })

    it('allows error item HTML inside "a" tag to be passed un-escaped', () => {
      const $ = cheerio.load(render('error-summary', examples['error list with html link']))

      const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li a').html().trim()

      expect(errorItemText).toEqual('Descriptive link to the <b>question</b> with an error')
    })

    it('allows error item text inside "a" tag to be passed whilst escaping HTML entities', () => {
      const $ = cheerio.load(render('error-summary', examples['error list with html as text link']))

      const errorItemText = $('.govuk-error-summary .govuk-error-summary__list li a').html().trim()

      expect(errorItemText).toEqual('Descriptive link to the &lt;b&gt;question&lt;/b&gt; with an error')
    })

    it('allows to disable autofocus', () => {
      const $ = cheerio.load(render('error-summary', examples['autofocus disabled']))

      const $component = $('.govuk-error-summary')
      expect($component.attr('data-disable-auto-focus')).toBe('true')
    })

    it('allows to explicitely enable autofocus', () => {
      const $ = cheerio.load(render('error-summary', examples['autofocus explicitly enabled']))

      const $component = $('.govuk-error-summary')
      expect($component.attr('data-disable-auto-focus')).toBe('false')
    })
  })
})
