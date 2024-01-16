// Listen for messages from container page for <iframe> resize
import 'iframe-resizer/js/iframeResizer.contentWindow.js'

// Uncomment to test if the accessible autocomplete works OK
// when loaded via CommonJS.
//
// If doing so, make sure you comment the ESModule (thereafter)
// and the script way of loading it (in `component-preview.njk`)
// import './accessible-autocomplete.js'

// Uncomment to test if the accessible autocomplete works OK
// when imported as an ESModule
//
// If doing so, make sure you comment the CommonJS (right before)
// and the script way of loading it (in `component-preview.njk`)
// import accessibleAutocomplete from 'accessible-autocomplete'
//
// const selectElement = document.querySelector('.govuk-select')
// if (selectElement) {
//   accessibleAutocomplete.enhanceSelectElement({
//     selectElement
//   })
// }
