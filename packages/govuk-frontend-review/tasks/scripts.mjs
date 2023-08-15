import { npm } from '@govuk-frontend/tasks'
import gulp from 'gulp'

/**
 * JavaScripts task (for watch)
 * Documentation
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) =>
  gulp.series(npm.script('build:jsdoc', [], options))
