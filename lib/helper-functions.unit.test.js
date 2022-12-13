const helpers = require('../lib/helper-functions')

describe('componentNameToJavaScriptClassName', () => {
  it('transforms a single word component name', () => {
    expect(helpers.componentNameToJavaScriptClassName('button'))
      .toBe('Button')
  })

  it('transforms a multi-word component name', () => {
    expect(helpers.componentNameToJavaScriptClassName('character-count'))
      .toBe('CharacterCount')
  })
})

describe('componentNameToMacroName', () => {
  it('transforms a single word component name', () => {
    expect(helpers.componentNameToMacroName('button'))
      .toBe('govukButton')
  })

  it('transforms a multi-word component name', () => {
    expect(helpers.componentNameToMacroName('character-count'))
      .toBe('govukCharacterCount')
  })
})

describe('componentPathToModuleName', () => {
  it('transforms a single word component name', () => {
    expect(helpers.componentPathToModuleName('components/button/button.mjs'))
      .toBe('GOVUKFrontend.Button')
  })

  it('transforms a multi-word component name', () => {
    expect(helpers.componentPathToModuleName('components/character-count/character-count.mjs'))
      .toBe('GOVUKFrontend.CharacterCount')
  })

  it("transforms unknown components to 'GOVUKFrontend'", () => {
    expect(helpers.componentPathToModuleName('vendor/polyfills/Document.mjs'))
      .toBe('GOVUKFrontend')
  })
})
