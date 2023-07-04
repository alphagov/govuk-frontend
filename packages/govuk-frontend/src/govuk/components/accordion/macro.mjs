import { renderComponent } from '@govuk-frontend/lib/components'

/**
 * Accordion component render
 *
 * @param {AccordionOptions} options - Nunjucks macro options
 * @returns {string} Component HTML
 */
export function govukAccordion(options) {
  return renderComponent('accordion', options)
}

/**
 * Accordion Nunjucks macro options
 *
 * @typedef {object} AccordionOptions
 * @property {string} id - {@link AccordionParams#id}
 * @property {number} [headingLevel=2] - {@link AccordionParams#headingLevel}
 * @property {string} [classes] - {@link AccordionParams#classes}
 * @property {{ [attribute: string]: string }} [attributes] - {@link AccordionParams#attributes}
 * @property {boolean} [rememberExpanded=true] - {@link AccordionParams#rememberExpanded}
 * @property {string} [hideAllSectionsText] - {@link AccordionParams#hideAllSectionsText}
 * @property {string} [hideSectionText] - {@link AccordionParams#hideSectionText}
 * @property {string} [hideSectionAriaLabelText] - {@link AccordionParams#hideSectionAriaLabelText}
 * @property {string} [showAllSectionsText] - {@link AccordionParams#showAllSectionsText}
 * @property {string} [showSectionText] - {@link AccordionParams#showSectionText}
 * @property {string} [showSectionAriaLabelText] - {@link AccordionParams#showSectionAriaLabelText}
 * @property {AccordionSectionOptions[]} items - {@link AccordionParams#items}
 */

/**
 * Accordion section Nunjucks macro options
 *
 * @typedef {object} AccordionSectionOptions
 * @property {boolean} [expanded] - {@link AccordionSectionParams#expanded}
 * @property {{ text: string } | { html: string }} heading - {@link AccordionSectionParams#heading}
 * @property {{ text: string } | { html: string }} [summary] - {@link AccordionSectionParams#summary}
 * @property {{ text: string } | { html: string }} content - {@link AccordionSectionParams#content}
 */

/**
 * @typedef {import('./options/params.mjs')["params"]} AccordionParams
 * @typedef {AccordionParams["items"]["params"]} AccordionSectionParams
 */
