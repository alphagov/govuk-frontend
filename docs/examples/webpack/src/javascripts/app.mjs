import { Button } from 'govuk-frontend'

const $buttons = document.querySelectorAll('[data-module="govuk-button"]')

$buttons.forEach(($button) => {
  /* eslint-disable-next-line no-new */
  new Button($button)
})
