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
    Text and links in the Header must:
    - have a text contrast ratio higher than 4.5:1 against the background colour to meet [WCAG AA](https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast)

    Links in the Header must:
    - accept focus
    - be focusable with a keyboard
    - be usable with a keyboard
    - indicate when they have focus
    - change in appearance when touched (in the touch-down state)
    - change in appearance when hovered
    - have visible text

    Images in the Header must:
    - be presentational when linked to from accompanying text (crown icon).

    Landmarks and Roles in the Header should:
    - have a role of \`"banner"\` at the root of the component (<header>) (https://www.w3.org/TR/wai-aria-1.1/#banner)
  `
}
