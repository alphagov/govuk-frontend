import prettier from '@prettier/sync'
import { outdent } from 'outdent'

import { inspect, componentNameToMacroName } from '../filters/index.mjs'

/**
 * Component Nunjucks code (formatted)
 *
 * @param {string} componentName - Component name
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} Nunjucks code for the component
 */
export function getNunjucksCode(componentName, options) {
  const macroName = componentNameToMacroName(componentName)

  // Allow nested HTML strings to wrap at `\n`
  const paramsFormatted = inspect(options.context)

  // Format Nunjucks safely with double quotes
  const macroFormatted = prettier.format(`${macroName}(${paramsFormatted})`, {
    parser: 'espree',
    semi: false,
    singleQuote: false,
    trailingComma: 'none'
  })

  return outdent`
    {% from "govuk/components/${componentName}/macro.njk" import ${macroName} %}

    {{ ${macroFormatted.trim()} }}
  `
}

/**
 * @typedef {import('@govuk-frontend/lib/components').MacroRenderOptions} MacroRenderOptions
 */
