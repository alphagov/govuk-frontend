import { join } from 'path'

import { paths, pkg } from 'govuk-frontend-config'
import { files, scripts, styles, task } from 'govuk-frontend-tasks'
import gulp from 'gulp'

/**
 * Build dist task
 * Prepare dist folder for release
 */
export default gulp.series(
  task.name('clean:release', () =>
    files.clean('*', {
      destPath: paths.dist
    })
  ),

  // Copy GOV.UK Frontend static assets
  task.name("copy:release 'assets'", () =>
    files.copy('*/**', {
      srcPath: join(paths.package, 'src/govuk/assets'),
      destPath: join(paths.dist, 'assets')
    })
  ),

  // Compile GOV.UK Frontend JavaScript to Universal Module Definition (UMD)
  task.name('scripts:release', () =>
    scripts.compile('all.mjs', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: paths.dist,

      filePath (file) {
        return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.js`)
      }
    })
  ),

  // Compile GOV.UK Frontend Sass
  task.name('styles:release', () =>
    styles.compile('**/[!_]*.scss', {
      srcPath: join(paths.package, 'src/govuk'),
      destPath: paths.dist,

      filePath (file) {
        return join(file.dir, `${file.name.replace(/^all/, pkg.name)}-${pkg.version}.min.css`)
      }
    })
  ),

  // Update GOV.UK Frontend version
  task.name("version:release 'VERSION.txt'", () =>
    files.version('VERSION.txt', {
      destPath: paths.dist
    })
  )
)
