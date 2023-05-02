import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import { components, configs, files, scripts, styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Build package task
 * Prepare package/dist folder for publishing
 */
export default gulp.series(
  task.name('clean', () =>
    files.clean('*', {
      destPath: join(paths.package, 'dist'),
      ignore: [
        '**/package.json',
        '**/README.md'
      ]
    })
  ),

  // Copy GOV.UK Frontend template files
  task.name('copy:templates', () =>
    files.copy('**/*.{md,njk}', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk')
    })
  ),

  // Copy GOV.UK Frontend static assets
  task.name('copy:assets', () =>
    files.copy('**/*', {
      srcPath: join(paths.package, 'src/govuk/assets'),
      destPath: join(paths.package, 'dist/govuk/assets')
    })
  ),

  // Generate GOV.UK Frontend fixtures.json from ${componentName}.yaml
  task.name('compile:fixtures', () =>
    components.generateFixtures('**/*.yaml', {
      srcPath: join(paths.package, 'src/govuk/components'),
      destPath: join(paths.package, 'dist/govuk/components')
    })
  ),

  // Generate GOV.UK Frontend macro-options.json from ${componentName}.yaml
  task.name('compile:macro-options', () =>
    components.generateMacroOptions('**/*.yaml', {
      srcPath: join(paths.package, 'src/govuk/components'),
      destPath: join(paths.package, 'dist/govuk/components')
    })
  ),

  // Compile GOV.UK Frontend JavaScript (ES modules)
  task.name('compile:mjs', () =>
    scripts.compile('!(*.test).mjs', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk-esm')
    })
  ),

  // Compile GOV.UK Frontend JavaScript (AMD modules)
  task.name('compile:js', () =>
    scripts.compile('**/!(*.test).mjs', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk'),

      filePath (file) {
        return join(file.dir, `${file.name}.js`)
      }
    })
  ),

  // Apply CSS prefixes to GOV.UK Frontend Sass
  task.name('compile:scss', () =>
    styles.compile('**/*.scss', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: join(paths.package, 'dist/govuk'),

      filePath (file) {
        return join(file.dir, `${file.name}.scss`)
      }
    })
  ),

  // Apply CSS prefixes to GOV.UK Prototype Kit Sass
  task.name("compile:scss 'govuk-prototype-kit'", () =>
    styles.compile('init.scss', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist/govuk-prototype-kit'),

      filePath (file) {
        return join(file.dir, `${file.name}.scss`)
      }
    })
  ),

  // Compile GOV.UK Prototype Kit config
  task.name("compile:js 'govuk-prototype-kit'", () =>
    configs.compile('govuk-prototype-kit.config.mjs', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist'),

      filePath (file) {
        return join(file.dir, `${file.name}.json`)
      }
    })
  ),

  // Copy GOV.UK Prototype Kit JavaScript
  task.name("copy:files 'govuk-prototype-kit'", () =>
    files.copy('**/*.js', {
      srcPath: join(paths.package, 'src/govuk-prototype-kit'),
      destPath: join(paths.package, 'dist/govuk-prototype-kit')
    })
  )
)
