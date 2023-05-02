import { join } from 'path'

import { components, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Component data and macro fixtures (for watch)
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export const compile = (options) => gulp.series(
  /**
   * Generate GOV.UK Frontend fixtures.json from ${componentName}.yaml
   */
  task.name('compile:fixtures', () =>
    components.generateFixtures('**/*.yaml', {
      srcPath: join(options.srcPath, 'govuk/components'),
      destPath: join(options.destPath, 'govuk/components')
    })
  ),

  /**
   * Generate GOV.UK Frontend macro-options.json from ${componentName}.yaml
   */
  task.name('compile:macro-options', () =>
    components.generateMacroOptions('**/*.yaml', {
      srcPath: join(options.srcPath, 'govuk/components'),
      destPath: join(options.destPath, 'govuk/components')
    })
  )
)
