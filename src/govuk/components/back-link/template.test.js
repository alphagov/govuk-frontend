const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('back-link component', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('back-link')
  })

  it('renders the default example with an anchor, href and text correctly', () => {
    const $ = render('back-link', examples.default)

    const $component = $('.govuk-back-link')
    expect($component.get(0).tagName).toEqual('a')
    expect($component.attr('href')).toEqual('#')
    expect($component.text()).toEqual('Back')
  })

  it('renders classes correctly', () => {
    const $ = render('back-link', examples.classes)

    const $component = $('.govuk-back-link')
    expect($component.hasClass('app-back-link--custom-class')).toBeTruthy()
  })

  it('renders custom text correctly', () => {
    const $ = render('back-link', examples['with custom text'])

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('Back to home')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('back-link', examples['html as text'])

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('&lt;b&gt;Home&lt;/b&gt;')
  })

  it('renders html correctly', () => {
    const $ = render('back-link', examples.html)

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('<b>Back</b>')
  })

  it('renders default text correctly', () => {
    const $ = render('back-link', examples.default)

    const $component = $('.govuk-back-link')
    expect($component.html()).toEqual('Back')
  })

  it('renders attributes correctly', () => {
    const $ = render('back-link', examples.attributes)

    const $component = $('.govuk-back-link')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('aria-label')).toEqual('Back to home')
  })

  it('renders with inverted colours if specified', () => {
    const $ = render('back-link', examples.inverse)

    const $component = $('.govuk-back-link')
    expect($component.hasClass('govuk-back-link--inverse')).toBeTruthy()
  })
})
