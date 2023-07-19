import { inspect } from 'util'

import prettier from '@prettier/sync'
import { outdent } from 'outdent'

import { componentNameToMacroName } from '../filters/index.mjs'

/**
 * Component Nunjucks code (formatted)
 *
 * @param {string} componentName - Component name
 * @param {unknown} params - Component macro params
 * @returns {string} Nunjucks code
 */
export function getNunjucksCode (componentName, params) {
  const macroName = componentNameToMacroName(componentName)

  // Allow nested HTML strings to wrap at `\n`
  const paramsFormatted = inspect(params, {
    compact: false,
    depth: Infinity,
    maxArrayLength: Infinity,
    maxStringLength: Infinity
  })

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
