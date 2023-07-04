import { renderComponent } from '@govuk-frontend/lib/components'

/**
 * Back link component render
 *
 * @param {BackLinkOptions} options - Nunjucks macro options
 * @returns {string} Component HTML
 */
export function govukBackLink(options) {
  return renderComponent('back-link', options)
}

/**
 * Back link Nunjucks macro options
 *
 * @typedef {object} BackLinkOptions
 * @property {string} [text] - {@link BackLinkParams#text}
 * @property {string} [html] - {@link BackLinkParams#html}
 * @property {string} href - {@link BackLinkParams#href}
 * @property {string} [classes] - {@link BackLinkParams#classes}
 * @property {{ [attribute: string]: string }} [attributes] - {@link BackLinkParams#attributes}
 */

/**
 * @typedef {import('./options/params.mjs')["params"]} BackLinkParams
 */
