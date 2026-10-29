import { task } from 'gulp'

import * as build from './tasks/build/index.mjs'
import { options, targets } from './tasks/build/options.mjs'
import {
  assets,
  fixtures,
  scripts,
  styles,
  templates,
  watch
} from './tasks/index.mjs'

/**
 * Build target tasks
 */
task('build:package', build.package(targets.package))
task('build:release', build.release(targets.release))
task('dev', build.dev(options))

/**
 * Utility tasks
 */
task('assets', assets(options))
task('fixtures', fixtures(options))
task('scripts', scripts(options))
task('styles', styles(options))
task('templates', templates(options))
task('watch', watch(options))
