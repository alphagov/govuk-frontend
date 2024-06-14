import { observeElementProperty } from './observe-element-property.mjs'

describe('observeElementProperty', () => {
  it('fires a callback function when a property value is updated', () => {
    const $element = document.createElement('button')
    let callbackCalled = false

    observeElementProperty($element, 'disabled', () => (callbackCalled = true))
    $element.disabled = true

    expect(callbackCalled).toBeTruthy()
  })

  it('returns the values of properties unaltered', () => {
    // This test is not directly related to the function, but as we have to
    // reimplement the native getter function as part of it, we should make
    // sure it still works.
    const testString = '  hello $ world!  3'

    // Unobserved input element
    const $unobservedInput = document.createElement('input')
    $unobservedInput.value = testString

    // Observed input element
    const $observedInput = document.createElement('input')
    observeElementProperty($observedInput, 'value', function () {})
    $observedInput.value = testString

    expect($observedInput.value).toStrictEqual($unobservedInput.value)
  })
})
