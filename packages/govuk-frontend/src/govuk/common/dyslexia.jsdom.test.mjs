import { initDyslexiaMode } from './dyslexia.mjs'

describe('Dyslexia Mode', () => {
  let $toggle

  beforeEach(() => {
    // 1. Set up our document body
    document.body.innerHTML = `
      <button id="dyslexia-toggle">Dyslexia-friendly font</button>
    `
    $toggle = document.getElementById('dyslexia-toggle')

    // Clear localStorage before each test
    window.localStorage.clear()
  })

  test('should add the dyslexia class to body when clicked', () => {
    initDyslexiaMode()
    $toggle.click()
    expect(document.body).toHaveClass('govuk-body--dyslexia-mode')
    expect(window.localStorage.getItem('dyslexia-mode')).toBe('true')
  })

  test('should persist the setting on page load', () => {
    window.localStorage.setItem('dyslexia-mode', 'true')

    initDyslexiaMode()

    expect(document.body).toHaveClass('govuk-body--dyslexia-mode')
    expect($toggle.innerText).toBe('Standard font')
  })
})
