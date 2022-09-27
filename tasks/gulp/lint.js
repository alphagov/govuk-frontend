const gulp = require('gulp')
const { npmScriptTask } = require('../run.js')

/**
 * JavaScript code quality checks via ESLint
 */
gulp.task('js:lint', npmScriptTask('lint:js', ['--silent']))

/**
 * Sass code quality checks via Stylelint
 */
gulp.task('scss:lint', npmScriptTask('lint:scss', ['--silent']))
