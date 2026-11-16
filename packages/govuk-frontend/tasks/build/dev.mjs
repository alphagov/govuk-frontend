import { series } from 'gulp'

import { watch } from '../index.mjs'

/**
 * Dev task
 * Runs a sequence of tasks on start
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export default function dev(options) {
  return series(watch(options))
}
