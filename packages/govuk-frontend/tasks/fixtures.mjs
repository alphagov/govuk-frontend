import { components, task } from '@govuk-frontend/tasks'
import { series } from 'gulp'

/**
 * Component fixtures and macro options (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) =>
  series(
    /**
     * Generate GOV.UK Frontend fixtures.json from ${componentName}.yaml
     */
    task.name('compile:fixtures', () =>
      components.generateFixtures('**/*.yaml', options)
    ),

    /**
     * Generate GOV.UK Frontend macro-options.json from ${componentName}.yaml
     */
    task.name('compile:macro-options', () =>
      components.generateMacroOptions('**/*.yaml', options)
    )
  )
