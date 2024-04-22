const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Service Header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('service-header')
  })

  describe('with no options set', () => {
    it("doesn't output anything", () => {
      const $ = render('service-header', examples['with no options set'])

      const $component = $('.govuk-service-header')
      expect($component).toHaveLength(0)
    })
  })
})
