// @ts-nocheck
import * as GOVUKFrontend from '../govuk/govuk-frontend.min.js'

// Maintain window global for compatibility
window.GOVUKFrontend = GOVUKFrontend

if (
  window.GOVUKPrototypeKit &&
  window.GOVUKPrototypeKit.documentReady &&
  window.GOVUKPrototypeKit.majorVersion >= 13
) {
  window.GOVUKPrototypeKit.documentReady(() => {
    window.GOVUKFrontend.initAll()
  })
}
