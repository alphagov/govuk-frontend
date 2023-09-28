import { join } from 'path'

import { components, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * Component fixtures and macro options (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) =>
  gulp.series(
    /**
     * Generate GOV.UK Frontend fixtures.json from ${componentName}/options/data.mjs
     */
    task.name('compile:fixtures', () =>
      components.generateFixtures({
        srcPath: options.srcPath,
        destPath: join(options.destPath, 'govuk/components')
      })
    ),

    /**
     * Generate GOV.UK Frontend macro-options.json from ${componentName}/options/data.mjs
     */
    task.name('compile:macro-options', () =>
      components.generateMacroOptions({
        destPath: join(options.destPath, 'govuk/components')
      })
    )
  )
