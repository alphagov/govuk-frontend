import { renderComponent } from '@govuk-frontend/lib/components'

/**
 * Breadcrumbs component render
 *
 * @param {BreadcrumbsOptions} options - Nunjucks macro options
 * @returns {string} Component HTML
 */
export function govukBreadcrumbs(options) {
  return renderComponent('breadcrumbs', options)
}

/**
 * Breadcrumbs Nunjucks macro options
 *
 * @typedef {object} BreadcrumbsOptions
 * @property {BreadcrumbsItemWithTextOptions[] | BreadcrumbsItemWithHtmlOptions[]} items - {@link BreadcrumbsParams#items}
 * @property {string} [classes] - {@link BreadcrumbsParams#classes}
 * @property {boolean} [collapseOnMobile] - {@link BreadcrumbsParams#collapseOnMobile}
 * @property {{ [attribute: string]: string }} [attributes] - {@link BreadcrumbsParams#attributes}
 */

/**
 * Breadcrumbs item Nunjucks macro options (variations)
 *
 * @typedef {BreadcrumbsItemOptions & { text: string }} BreadcrumbsItemWithTextOptions
 * @typedef {BreadcrumbsItemOptions & { html: string }} BreadcrumbsItemWithHtmlOptions
 */

/**
 * Breadcrumbs item Nunjucks macro options
 *
 * @typedef {object} BreadcrumbsItemOptions
 * @property {string} [href] - {@link BreadcrumbsItemParams#href}
 * @property {{ [attribute: string]: string }} [attributes] - {@link BreadcrumbsItemParams#attributes}
 */

/**
 * @typedef {import('./options/params.mjs')["params"]} BreadcrumbsParams
 * @typedef {BreadcrumbsParams["items"]["params"]} BreadcrumbsItemParams
 */
