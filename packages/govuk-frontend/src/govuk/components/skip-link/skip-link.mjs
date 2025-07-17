import { setFocus } from '../../common/index.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

/**
 * Skip link component
 *
 * @preserve
 * @augments Component<HTMLAnchorElement>
 */
export class SkipLink extends Component {
  static elementType = HTMLAnchorElement

  /**
   * @param {Element | null} $root - HTML element to use for skip link
   * @throws {ElementError} when $root is not set or the wrong type
   * @throws {ElementError} when $root.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($root) {
    super($root)

    const hash = this.$root.hash
    const href = this.$root.getAttribute('href') ?? ''

    // Return early for external URLs or links to other pages
    if (
      this.$root.origin !== window.location.origin ||
      this.$root.pathname !== window.location.pathname
    ) {
      return
    }

    const linkedElementId = hash.replace('#', '')

    // Check link path matching current page
    if (!linkedElementId) {
      throw new ElementError(
        `Skip link: Target link (\`href="${href}"\`) has no hash fragment`
      )
    }

    const $linkedElement = document.getElementById(linkedElementId)

    // Check for link target element
    if (!$linkedElement) {
      throw new ElementError({
        component: SkipLink,
        element: $linkedElement,
        identifier: `Target content (\`id="${linkedElementId}"\`)`
      })
    }

    /**
     * Focus the linked element on click
     *
     * Adds a helper CSS class to hide native focus styles,
     * but removes it on blur to restore native focus styles
     */
    this.$root.addEventListener('click', () =>
      setFocus($linkedElement, {
        onBeforeFocus() {
          $linkedElement.classList.add('govuk-skip-link-focused-element')
        },
        onBlur() {
          $linkedElement.classList.remove('govuk-skip-link-focused-element')
        }
      })
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-skip-link'
}
