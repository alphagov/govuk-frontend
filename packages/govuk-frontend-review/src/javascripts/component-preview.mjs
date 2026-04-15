import { iframeResize } from 'iframe-resizer'

const $examples = document.querySelectorAll('iframe.js-component-preview')

/**
 * Resize component preview iframe
 *
 * @this {HTMLIFrameElement}
 */
function resize() {
  iframeResize(
    {
      // Omit scrolling as this otherwise adds the iframe `scrolling` attribute
      // which is deprecated
      scrolling: 'omit',
      onInit: () => {
        // Set the y axis overflow of the HTML element within the resized iframe
        // to 'hidden'.
        // This is to remove a functionally useless visible scrollbar within
        // component preview iframes that appears because we're omitting scrolling
        // via iframe-resizer and we've set `overflow-y: scroll` on `govuk-template`
        // which we need to override to remove the scroll bar.
        // We need to do this at the js level rather than in sass in case
        // iframe-resizer fails to run, leaving us with a bunch of iframes whose
        // sizes might mean we need to scroll to see the whole component, which
        // we wouldn't be able to do if this was applied by default.
        this.contentWindow.document.documentElement.style.overflowY = 'hidden'
      }
    },
    this
  )
}

/**
 * Defer resize for lazy-loaded iframes
 */
document.addEventListener('DOMContentLoaded', () =>
  $examples.forEach(($example) =>
    $example.loading === 'lazy'
      ? $example.addEventListener('load', resize)
      : resize.call($example)
  )
)
