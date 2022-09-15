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

describe('componentNameToJavaScriptModuleName', () => {
  it('transforms a single word component name', () => {
    expect(helpers.componentNameToJavaScriptModuleName('button'))
      .toBe('GOVUKFrontend.Button')
  })

  it('transforms a multi-word component name', () => {
    expect(helpers.componentNameToJavaScriptModuleName('character-count'))
      .toBe('GOVUKFrontend.CharacterCount')
  })
})
