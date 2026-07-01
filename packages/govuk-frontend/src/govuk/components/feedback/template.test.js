const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Feedback', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('feedback')
  })

  describe('default example', () => {
    it('renders title text', () => {
      const $ = render('feedback', examples.default)
      const feedbackTitle = $('.govuk-feedback__title').text().trim()

      expect(feedbackTitle).toBe('Help us improve this service')
    })

    it('renders title as h2 (as the default heading level)', () => {
      const $ = render('feedback', examples.default)
      const feedbackTitleHeadingLevel = $('.govuk-feedback__title')[0].name

      expect(feedbackTitleHeadingLevel).toBe('h2')
    })

    it('renders body text', () => {
      const $ = render('feedback', examples.default)
      const feedbackBody = $('.govuk-feedback__body').html().trim()

      expect(feedbackBody).toBe(
        'Tell us about your experience using this service. <a href="#" class="govuk-link">Give us your feedback</a>'
      )
    })
  })

  describe('custom options', () => {
    it('renders title html', () => {
      const $ = render('feedback', examples['html in title'])
      const feedbackTitle = $('.govuk-feedback__title').html().trim()

      expect(feedbackTitle).toBe('Help us improve this <em>cool</em> service')
    })

    it('renders title with a custom heading level', () => {
      const $ = render('feedback', examples['custom heading level'])
      const feedbackTitleHeadingLevel = $('.govuk-feedback__title')[0].name

      expect(feedbackTitleHeadingLevel).toBe('h3')
    })

    it('escapes html passed to titleText', () => {
      const $ = render('feedback', examples['html in text options'])
      const feedbackTitle = $('.govuk-feedback__title').html().trim()

      expect(feedbackTitle).toBe(
        'Help us improve this &lt;em&gt;cool&lt;/em&gt; service'
      )
    })

    it('escapes html passed to text', () => {
      const $ = render('feedback', examples['html in text options'])
      const feedbackBody = $('.govuk-feedback__body').html().trim()

      expect(feedbackBody).toBe(
        'Tell us about your experience using this &lt;em&gt;cool&lt;/em&gt; service'
      )
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('feedback', examples.classes)

      const $component = $('.govuk-feedback')
      expect($component.hasClass('my-first-class my-second-class')).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('feedback', examples.attributes)

      const $component = $('.govuk-feedback')
      expect($component.attr('first-attribute')).toBe('first')
      expect($component.attr('second-attribute')).toBe('second')
    })
  })
})
