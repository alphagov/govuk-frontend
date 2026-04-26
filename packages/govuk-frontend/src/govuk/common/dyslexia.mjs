/**
 * Dyslexia Mode
 *
 * Provides a global toggle for OpenDyslexic font and spacing adjustments.
 *
 * @returns {void}
 */
export function initDyslexiaMode() {
  /**
   * Apply or remove dyslexia mode styles
   *
   * @param {boolean} isEnabled - Whether to enable dyslexia mode
   */
  const applyMode = (isEnabled) => {
    if (isEnabled) {
      document.body.style.setProperty(
        '--govuk-font-family',
        'OpenDyslexic, arial, sans-serif'
      )
      document.body.classList.add('govuk-body--dyslexia-mode')
    } else {
      document.body.style.removeProperty('--govuk-font-family')
      document.body.classList.remove('govuk-body--dyslexia-mode')
    }
  }

  // 1. Initial Check on Page Load
  const savedPreference = localStorage.getItem('dyslexia-mode') === 'true'
  applyMode(savedPreference)

  // 2. Setup Toggle Button logic
  const toggleBtn = document.getElementById('dyslexia-toggle')
  if (toggleBtn) {
    toggleBtn.innerText = savedPreference
      ? 'Standard font'
      : 'Dyslexia-friendly font'

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault()
      const currentState = localStorage.getItem('dyslexia-mode') === 'true'
      const newState = !currentState

      // Fix: localStorage.setItem only accepts strings
      localStorage.setItem('dyslexia-mode', String(newState))

      applyMode(newState)
      toggleBtn.innerText = newState
        ? 'Standard font'
        : 'Dyslexia-friendly font'
    })
  }
}
