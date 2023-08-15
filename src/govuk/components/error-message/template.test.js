const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Error message', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('error-message')
  })

  it('renders with a custom id', () => {
    const $ = render('error-message', examples.id)

    const $component = $('.govuk-error-message')
    expect($component.attr('id')).toEqual('my-error-message-id')
  })

  it('allows additional classes to specified', () => {
    const $ = render('error-message', examples.classes)

    const $component = $('.govuk-error-message')
    expect($component.hasClass('custom-class')).toBeTruthy()
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-message', examples['html as text'])

    const content = $('.govuk-error-message').html().trim()
    expect(content).toContain('Unexpected &gt; in body')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('error-message', examples.html)

    const content = $('.govuk-error-message').html().trim()
    expect(content).toContain('Unexpected <b>bold text</b> in body copy')
  })

  it('allows additional attributes to be specified', () => {
    const $ = render('error-message', examples.attributes)

    const $component = $('.govuk-error-message')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-error-message')
  })

  it('includes a visually hidden "Error" prefix by default', () => {
    const $ = render('error-message', examples.default)

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual(
      'Error: Error message about full name goes here'
    )
  })

  it('allows the visually hidden prefix to be customised', () => {
    const $ = render('error-message', examples['with visually hidden text'])

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual('Gwall: Rhowch eich enw llawn')
  })

  it('allows the visually hidden prefix to be removed', () => {
    const $ = render('error-message', examples['visually hidden text removed'])

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual('There is an error on line 42')
  })

  it('allows the visually hidden prefix to be removed and then manually added with HTML', () => {
    const $ = render('error-message', examples.translated)

    const $component = $('.govuk-error-message')
    expect($component.html().trim()).toContain(
      '<span class="govuk-visually-hidden">Gwall:</span> Neges gwall am yr enw llawn yn mynd yma'
    )
  })
})
