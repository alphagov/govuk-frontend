import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { configs, scripts, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * JavaScripts task (for watch)
 */
export const compile = gulp.series(
  // Compile GOV.UK Frontend JavaScript to Universal Module Definition (UMD)
  task.name("scripts:package 'govuk'", () =>
    scripts.compile('**/!(*.test).mjs', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk'),

      filePath (file) {
        return join(file.dir, `${file.name}.js`)
      }
    })
  ),

  // Compile GOV.UK Frontend JavaScript to ECMAScript Modules (ESM)
  task.name("scripts:package 'govuk-esm'", () =>
    scripts.compile('!(*.test).mjs', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk-esm')
    })
  ),

  // Compile GOV.UK Prototype Kit config
  task.name("scripts:package 'govuk-prototype-kit'", () =>
    configs.compile('govuk-prototype-kit.config.mjs', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist'),

      filePath (file) {
        return join(file.dir, `${file.name}.json`)
      }
    })
  )
)
