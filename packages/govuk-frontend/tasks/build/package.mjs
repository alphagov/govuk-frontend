import { join } from 'path'

import { files, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

import { fixtures, scripts, styles, templates } from '../index.mjs'

/**
 * Build package task
 * Prepare packages/govuk-frontend/dist folder for publishing
 *
 * @type {import('govuk-frontend-tasks').TaskFunction}
 */
export default (options) => gulp.series(
  task.name('clean', () =>
    files.clean('*', {
      destPath: options.destPath,
      ignore: [
        '**/package.json',
        '**/README.md'
      ]
    })
  ),

  fixtures(options),
  scripts(options),
  styles(options),
  templates(options),

  // Copy GOV.UK Frontend static assets
  task.name('copy:assets', () =>
    files.copy('**/*', {
      srcPath: join(options.srcPath, 'govuk/assets'),
      destPath: join(options.destPath, 'govuk/assets')
    })
  ),

  // Copy GOV.UK Prototype Kit JavaScript
  task.name("copy:files 'govuk-prototype-kit'", () =>
    files.copy('**/*.js', {
      srcPath: join(options.srcPath, 'govuk-prototype-kit'),
      destPath: join(options.destPath, 'govuk-prototype-kit')
    })
  )
)
