import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { components, files, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { scripts, styles } from '../index.mjs'

/**
 * Build package task
 * Prepare packages/govuk-frontend/dist folder for npm publish
 */
export default gulp.series(
  task.name('clean:package', () =>
    files.clean('*', {
      destPath: join(paths.package, 'dist')
    })
  ),

  // Copy GOV.UK Frontend template files
  task.name("copy:package 'templates'", () =>
    files.copy('**/*.{md,njk}', {
      srcPath: join(paths.package, 'src'),
      destPath: join(paths.package, 'dist')
    })
  ),

  // Copy GOV.UK Frontend static assets
  task.name("copy:package 'assets'", () =>
    files.copy('**/*', {
      srcPath: join(paths.package, 'src/govuk/assets'),
      destPath: join(paths.package, 'dist/govuk/assets')
    })
  ),

  // Generate GOV.UK Frontend fixtures.json from ${componentName}.yaml
  task.name('fixtures:package', () =>
    components.generateFixtures('**/*.yaml', {
      srcPath: join(paths.package, 'src/govuk/components'),
      destPath: join(paths.package, 'dist/govuk/components')
    })
  ),

  // Generate GOV.UK Frontend macro-options.json from ${componentName}.yaml
  task.name('macro-options:package', () =>
    components.generateMacroOptions('**/*.yaml', {
      srcPath: join(paths.package, 'src/govuk/components'),
      destPath: join(paths.package, 'dist/govuk/components')
    })
  ),

  scripts,
  styles,

  // Copy GOV.UK Prototype Kit JavaScript
  task.name("copy:package 'govuk-prototype-kit'", () =>
    files.copy('**/*.js', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist/govuk-prototype-kit')
    })
  )
)
