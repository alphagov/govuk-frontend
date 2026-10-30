import { paths } from '@govuk-frontend/config'
import { npm, task } from '@govuk-frontend/tasks'
import { dest, series, src } from 'gulp'

import { assets, fixtures, scripts, styles, templates } from '../index.mjs'

/**
 * Build package task
 * Prepare packages/govuk-frontend/dist folder for publishing
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default (options) =>
  series(
    npm.script('clean', [], { basePath: paths.stats }),
    npm.script('clean:package', [], options),

    assets(options),
    fixtures(options),
    scripts(options),
    styles(options),
    templates(options),

    // Copy GOV.UK Prototype Kit JavaScript
    task.create("copy:files 'govuk-prototype-kit'", () =>
      src('govuk-prototype-kit/**/*.js', {
        base: options.srcPath,
        cwd: options.srcPath
      }).pipe(dest(options.destPath))
    )
  )
