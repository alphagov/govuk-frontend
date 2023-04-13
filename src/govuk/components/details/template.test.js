const cheerio = require('cheerio')

const { getExamples } = require('../../../../lib/file-helper')
const { axe } = require('../../../../lib/jest-helpers')
const { render } = require('../../../../lib/nunjucks-helpers')

describe('Details', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('details')
  })

  it('default example passes accessibility tests', async () => {
    const $ = cheerio.load(render('details', examples.default))

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a details element', () => {
    const $ = cheerio.load(render('details', examples.default))

    const $component = $('.govuk-details')
    expect($component.get(0).tagName).toEqual('details')
  })

  it('renders with a custom id', () => {
    const $ = cheerio.load(render('details', examples.id))

    const $component = $('.govuk-details')
    expect($component.attr('id')).toEqual('my-details-element')
  })

  it('is collapsed by default', () => {
    const $ = cheerio.load(render('details', examples.default))

    const $component = $('.govuk-details')
    expect($component.attr('open')).toBeFalsy()
  })

  it('can be opened by default', () => {
    const $ = cheerio.load(render('details', examples.expanded))

    const $component = $('.govuk-details')
    expect($component.attr('open')).toBeTruthy()
  })

  it('includes a nested summary', () => {
    const $ = cheerio.load(render('details', examples.default))

    // Look for the summary element _within_ the details element
    const $summary = $('.govuk-details .govuk-details__summary')
    expect($summary.get(0).tagName).toEqual('summary')
  })

  it('renders nested components using `call`', () => {
    const $ = cheerio.load(render('details', {}, '<div class="app-nested-component"></div>'))

    expect($('.govuk-details .app-nested-component').length).toBeTruthy()
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = cheerio.load(render('details', examples['html as text']))

    const detailsText = $('.govuk-details__text').html().trim()
    expect(detailsText).toEqual('More about the greater than symbol (&gt;)')
  })

  it('allows HTML to be passed un-escaped', () => {
    const $ = cheerio.load(render('details', examples.html))

    const detailsText = $('.govuk-details__text').html().trim()
    expect(detailsText).toEqual('More about <b>bold text</b>')
  })

  it('allows summary text to be passed whilst escaping HTML entities', () => {
    const $ = cheerio.load(render('details', examples['summary html as text']))

    const detailsText = $('.govuk-details__summary-text').html().trim()
    expect(detailsText).toEqual('The greater than symbol (&gt;) is the best')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = cheerio.load(render('details', examples['summary html']))

    const detailsText = $('.govuk-details__summary-text').html().trim()
    expect(detailsText).toEqual('Use <b>bold text</b> sparingly')
  })

  it('allows additional classes to be added to the details element', () => {
    const $ = cheerio.load(render('details', examples.classes))

    const $component = $('.govuk-details')
    expect($component.hasClass('some-additional-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the details element', () => {
    const $ = cheerio.load(render('details', examples.attributes))

    const $component = $('.govuk-details')
    expect($component.attr('data-some-data-attribute')).toEqual('i-love-data')
    expect($component.attr('another-attribute')).toEqual('foo')
  })
})
