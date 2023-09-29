// @ts-nocheck
import { initAll } from '../govuk/govuk-frontend.min.js'

if (
  window.GOVUKPrototypeKit &&
  window.GOVUKPrototypeKit.documentReady &&
  window.GOVUKPrototypeKit.majorVersion >= 13
) {
  window.GOVUKPrototypeKit.documentReady(() => {
    initAll()
  })
}
