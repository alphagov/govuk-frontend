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
  accessibilityCriteria: outdent`
    ## Conditional reveals
    Must:
    - be visible as static content if JavaScript is unavailable or fails
    - be hidden if JavaScript is available and is collapsed
    - indicate if content is expanded or collapsed
    - indicate that there is collapsed content to interact with

    Note that we have known issues against this criteria: https://github.com/alphagov/govuk_elements/issues/575
  `
}
