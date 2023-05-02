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

  return outdent`
    {% from "govuk/components/${componentName}/macro.njk" import ${macroName} %}

    {{ ${macroName}(${
      JSON.stringify(params, undefined, 2)
    }) }}
  `
}
