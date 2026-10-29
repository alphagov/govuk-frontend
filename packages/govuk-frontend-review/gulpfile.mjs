import { browser } from '@govuk-frontend/tasks'
import { task } from 'gulp'

import * as build from './tasks/build/index.mjs'
import { options } from './tasks/build/options.mjs'
import { scripts, styles, watch } from './tasks/index.mjs'

/**
 * Build target tasks
 */
task('build', build.dist(options))
task('dev', build.dev(options))

/**
 * Utility tasks
 */
task('scripts', scripts(options))
task('styles', styles(options))
task('watch', watch(options))

/**
 * Screenshots task
 * Sends screenshots to Percy for visual regression testing
 */
task('screenshots', browser.screenshots)
