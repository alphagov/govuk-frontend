/* eslint-env jest */

const helperFunctions = require('../lib/helper-functions')

describe('componentNameToMacroName', () => {
  it('transfoms a single word component name', () => {
    var macroName = helperFunctions.componentNameToMacroName('button')

    expect(macroName).toBe('govukButton')
  })

  it('transfoms a multi-word component name', () => {
    var macroName = helperFunctions.componentNameToMacroName('character-count')

    expect(macroName).toBe('govukCharacterCount')
  })
})

describe('componentNameToJavaScriptModuleName', () => {
  it('transfoms a single word component name', () => {
    var moduleName = helperFunctions.componentNameToJavaScriptModuleName('button')

    expect(moduleName).toBe('GOVUKFrontend.Button')
  })

  it('transfoms a multi-word component name', () => {
    var moduleName = helperFunctions.componentNameToJavaScriptModuleName('character-count')

    expect(moduleName).toBe('GOVUKFrontend.CharacterCount')
  })
})
