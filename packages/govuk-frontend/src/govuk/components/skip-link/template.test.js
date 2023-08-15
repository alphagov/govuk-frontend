const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Skip link', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('skip-link')
  })

  describe('default example', () => {
    it('renders text', () => {
      const $ = render('skip-link', examples.default)

      const $component = $('.govuk-skip-link')
      expect($component.html()).toEqual('Skip to main content')
    })

    it('renders default href', () => {
      const $ = render('skip-link', examples['no href'])

      const $component = $('.govuk-skip-link')
      expect($component.attr('href')).toEqual('#content')
    })
  })

  describe('custom options', () => {
    it('renders href', () => {
      const $ = render('skip-link', examples['custom href'])

      const $component = $('.govuk-skip-link')
      expect($component.attr('href')).toEqual('#custom')
    })

    it('renders text', () => {
      const $ = render('skip-link', examples['custom text'])

      const $component = $('.govuk-skip-link')
      expect($component.html()).toEqual('skip')
    })

    it('renders escaped html in text', () => {
      const $ = render('skip-link', examples['html as text'])

      const $component = $('.govuk-skip-link')
      expect($component.html()).toEqual('&lt;p&gt;skip&lt;/p&gt;')
    })

    it('renders html', () => {
      const $ = render('skip-link', examples.html)

      const $component = $('.govuk-skip-link')
      expect($component.html()).toEqual('<p>skip</p>')
    })

    it('renders classes', () => {
      const $ = render('skip-link', examples.classes)

      const $component = $('.govuk-skip-link')
      expect($component.hasClass('app-skip-link--custom-class')).toBeTruthy()
    })

    it('renders attributes', () => {
      const $ = render('skip-link', examples.attributes)

      const $component = $('.govuk-skip-link')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('aria-label')).toEqual('Skip to content')
    })

    it('renders a data-module attribute to initialise JavaScript', () => {
      const $ = render('skip-link', examples.default)

      const $component = $('.govuk-skip-link')

      expect($component.attr('data-module')).toEqual('govuk-skip-link')
    })
  })
})
