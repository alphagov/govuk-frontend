import { iframeResize } from 'iframe-resizer'

const $examples = document.querySelectorAll('iframe.js-component-preview')

/**
 * Resize component preview iframe
 *
 * @this {HTMLElement}
 */
function resize() {
  iframeResize({ scrolling: 'omit' }, this)
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
