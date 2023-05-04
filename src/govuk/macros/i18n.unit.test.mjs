import { callMacro } from 'govuk-frontend-helpers/nunjucks'

describe('i18n.njk', () => {
  describe('govukPluralisedI18nAttributes', () => {
    function callMacroUnderTest (...args) {
      return callMacro('govukPluralisedI18nAttributes', 'macros/i18n.njk', ...args)
    }

    it('renders a single plural type', () => {
      const attributes = callMacroUnderTest(['translation-key', { other: 'You have %{count} characters remaining.' }])
      // Note the starting space so we ensure it doesn't stick to possible other previous attributes
      expect(attributes).toEqual(' data-i18n.translation-key.other="You have %{count} characters remaining."')
    })

    it('renders multiple plural types', () => {
      const attributes = callMacroUnderTest(['translation-key', { other: 'You have %{count} characters remaining.', one: 'One character remaining' }])
      expect(attributes).toEqual(' data-i18n.translation-key.other="You have %{count} characters remaining." data-i18n.translation-key.one="One character remaining"')
    })

    it('outputs nothing if there are no translations', () => {
      const attributes = callMacroUnderTest(['translation-key', {}])
      expect(attributes).toEqual('')
    })
  })
})
