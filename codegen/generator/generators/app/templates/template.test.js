const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('<%= pascalWithSpaces %>', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('<%= kebabName %>')
  })

  describe('custom options', () => {
    it('renders with id', () => {
      const $ = render('<%= kebabName %>', examples.id)

      const $component = $('.govuk-<%= kebabName %>')
      expect($component.attr('id')).toBe('<%= kebabName %>')
    })
  })
})
