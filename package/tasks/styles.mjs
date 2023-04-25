import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Stylesheets task (for watch)
 */
export const compile = gulp.series(
  // Apply CSS prefixes to GOV.UK Frontend Sass
  task.name("styles:package 'govuk'", () =>
    styles.compile('**/*.scss', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk'),

      filePath (file) {
        return join(file.dir, `${file.name}.scss`)
      }
    })
  ),

  // Apply CSS prefixes to GOV.UK Prototype Kit Sass
  task.name("styles:package 'govuk-prototype-kit'", () =>
    styles.compile('init.scss', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist/govuk-prototype-kit'),

      filePath (file) {
        return join(file.dir, `${file.name}.scss`)
      }
    })
  )
)
