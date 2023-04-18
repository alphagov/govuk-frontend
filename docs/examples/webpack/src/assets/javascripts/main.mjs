import { Button } from 'govuk-frontend'

const $buttons = document.querySelectorAll('[data-module="govuk-button"]')

$buttons.forEach(($button) => {
  new Button($button).init()
})
