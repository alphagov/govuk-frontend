import { outdent } from 'outdent'

import { examples } from './examples.mjs'
import { params } from './params.mjs'

/**
 * Component data
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentData}
 */
export default {
  params,
  examples,
  previewLayout: 'full-width',
  accessibilityCriteria: outdent`
    Text and links in the Footer must:
    - have a text contrast ratio higher than 4.5:1 against the background colour to meet [WCAG AA](https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast)

    Links in the Footer must:
    - accept focus
    - be focusable with a keyboard
    - be usable with a keyboard
    - indicate when they have focus
    - change in appearance when touched (in the touch-down state)
    - change in appearance when hovered
    - have visible text

    Images in the Footer must:
    - be presentational when linked to from accompanying text (Open Government Licence (OGL) icon).
    - have a meaningful accessible name if also a linked element (crest icon).

    Landmarks and Roles in the Footer should:
    - avoid navigation landmarks or roles
      "The footer element alone is sufficient for such cases; while a nav element can be used in such cases, it is usually unnecessary." - (https://html.spec.whatwg.org/multipage/sections.html#the-nav-element)
      Note: This decision has been made based on prior experience seeing removal of overuse of \`<nav>\` elements from www.GOV.UK, which made it confusing for users of assistive technologies to know what were the most important navigation aspects of GOV.UK.
      Should be challenged if user research indicates this is an issue.

    - have a role of \`"contentinfo"\` at the root of the component (<footer>) (https://www.w3.org/TR/wai-aria-1.1/#contentinfo)
      Note: This decision has been made given that most uses of this role tend to be used directly on a \`<footer>\` element.
      Assumption made is that is most predictable for users of assistive technologies.
      The spec indicates that \`"contentinfo"\` is useful for "Examples of information included in this region of the page are copyrights and links to privacy statements.", which may indicate that it might be better placed around the 'meta' section of this component.
      Should be challenged if user research indicates this is an issue.

      See also: http://www.brucelawson.co.uk/2013/why-does-html-take-rolecontentinfo
  `
}
