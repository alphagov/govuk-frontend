const cheerio = require('cheerio')
const { helpers } = require('govuk-frontend-lib')

const { getExamples } = helpers.files
const { render } = helpers.nunjucks
const { axe } = helpers.tests

describe('fieldset', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('fieldset')
  })

  it('passes accessibility tests', async () => {
    const $ = cheerio.load(render('fieldset', examples.default))

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('creates a fieldset', () => {
    const $ = cheerio.load(render('fieldset', examples.default))

    const $component = $('fieldset.govuk-fieldset')
    expect($component.get(0).tagName).toContain('fieldset')
  })

  it('includes a legend element which captions the fieldset', () => {
    const $ = cheerio.load(render('fieldset', examples.default))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.get(0).tagName).toEqual('legend')
  })

  it('nests the legend within the fieldset', () => {
    const $ = cheerio.load(render('fieldset', examples.default))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.parent().get(0).tagName).toEqual('fieldset')
  })

  it('allows you to set the legend text', () => {
    const $ = cheerio.load(render('fieldset', examples.default))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.text().trim()).toEqual('What is your address?')
  })

  it('allows you to set the aria-describedby attribute', () => {
    const $ = cheerio.load(render('fieldset', examples['with describedBy']))

    const $component = $('.govuk-fieldset')
    expect($component.attr('aria-describedby')).toEqual('some-id')
  })

  it('escapes HTML in the text argument', () => {
    const $ = cheerio.load(render('fieldset', examples['html as text']))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.html()).toContain('&lt;b&gt;your&lt;/b&gt;')
  })

  it('does not escape HTML in the html argument', () => {
    const $ = cheerio.load(render('fieldset', examples.html))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.html()).toContain('<b>your</b>')
  })

  it('nests the legend text in an H1 if the legend is a page heading', () => {
    const $ = cheerio.load(render('fieldset', examples['as page heading l']))

    const $headingInsideLegend = $('.govuk-fieldset__legend > h1')
    expect($headingInsideLegend.text().trim()).toBe('What is your address?')
  })

  it('renders html when passed as fieldset content', () => {
    const $ = cheerio.load(render('fieldset', examples['html fieldset content']))

    expect($('.govuk-fieldset .my-content').text().trim()).toEqual('This is some content to put inside the fieldset')
  })

  it('renders nested components using `call`', () => {
    const $ = cheerio.load(render('fieldset', {}, '<div class="app-nested-component"></div>'))

    expect($('.govuk-fieldset .app-nested-component').length).toBeTruthy()
  })

  it('can have additional classes on the legend', () => {
    const $ = cheerio.load(render('fieldset', examples['legend classes']))

    const $legend = $('.govuk-fieldset__legend')
    expect($legend.hasClass('my-custom-class')).toBeTruthy()
  })

  it('can have additional classes on the fieldset', () => {
    const $ = cheerio.load(render('fieldset', examples.classes))

    const $component = $('.govuk-fieldset')
    expect($component.hasClass('app-fieldset--custom-modifier')).toBeTruthy()
  })

  it('can have an explicit role', () => {
    const $ = cheerio.load(render('fieldset', examples.role))

    const $component = $('.govuk-fieldset')
    expect($component.attr('role')).toEqual('group')
  })

  it('can have additional attributes', () => {
    const $ = cheerio.load(render('fieldset', examples.attributes))

    const $component = $('.govuk-fieldset')
    expect($component.attr('data-attribute')).toEqual('value')
  })
})
