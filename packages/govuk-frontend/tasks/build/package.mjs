import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { npm, task } from '@govuk-frontend/tasks'
import gulp from 'gulp'

import { assets, fixtures, scripts, styles, templates } from '../index.mjs'

/**
 * Build package task
 * Prepare packages/govuk-frontend/dist folder for publishing
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default (options) =>
  gulp.series(
    npm.script('clean', [], { basePath: paths.stats }),
    npm.script('clean:package', [], options),

    assets(options),
    fixtures(options),
    scripts(options),
    styles(options),
    templates(options),

    // Copy GOV.UK Prototype Kit JavaScript
    task.name("copy:files 'govuk-prototype-kit'", () =>
      gulp
        .src(join(options.srcPath, 'govuk-prototype-kit/**/*.js'))
        .pipe(gulp.dest(join(options.destPath, 'govuk-prototype-kit')))
    )
  )
