// An example of importing a single component from govuk-frontend and initialising it
import { Button } from 'govuk-frontend'

const $buttons = document.querySelectorAll('[data-module="govuk-button"]')

$buttons.forEach(($button) => {
  /* eslint-disable-next-line no-new */
  new Button($button)
})
