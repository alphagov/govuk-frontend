import { join, resolve } from 'path'

import { pkg } from '@govuk-frontend/config'
import { configs, scripts, task } from '@govuk-frontend/tasks'
import { series } from 'gulp'

import {
  createGlobFromPaths,
  deprecatedFilesPaths
} from './config/deprecated-scripts.mjs'

/**
 * JavaScripts task (for watch)
 *
 * @type {import('@govuk-frontend/tasks').TaskFunction}
 */
export const compile = (options) => {
  const args = [
    /**
     * Compile GOV.UK Frontend JavaScript for component entry points
     */
    task.create("compile:js 'components'", () =>
      scripts.compile('**/components/*/!(*.test).mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.publish.config.mjs')
      })
    ),

    ...(deprecatedFilesPaths?.length
      ? [
          /**
           * Compile deprecated files no longer imported by `all.mjs`
           * but that need to be kept in the package
           */
          task.create("compile:js 'deprecations'", () =>
            scripts.compile(createGlobFromPaths(deprecatedFilesPaths), {
              ...options,

              srcPath: join(options.srcPath, 'govuk'),
              destPath: join(options.destPath, 'govuk'),
              configPath: join(options.basePath, 'rollup.publish.config.mjs')
            })
          )
        ]
      : []),

    /**
     * Compile GOV.UK Frontend JavaScript for main entry point only
     */
    task.create("compile:js 'entry'", () =>
      scripts.compile('**/all.mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.publish.config.mjs')
      })
    ),

    /**
     * Compile GOV.UK Frontend JavaScript (minified) for main entry point only
     */
    task.create("compile:js 'minified'", () =>
      scripts.compile('**/all.mjs', {
        ...options,

        srcPath: join(options.srcPath, 'govuk'),
        destPath: join(options.destPath, 'govuk'),
        configPath: join(options.basePath, 'rollup.release.config.mjs'),

        // Rename using package name and `*.min.js` extension due to
        // web server ES module `*.mjs` Content-Type header support
        filePath({ dir, name }) {
          return join(dir, `${name.replace(/^all/, pkg.name)}.min.js`)
        }
      })
    ),

    /**
     * Compile GOV.UK Prototype Kit config
     */
    task.create("compile:js 'govuk-prototype-kit'", () =>
      configs.compile('govuk-prototype-kit.config.mjs', {
        srcPath: join(options.srcPath, 'govuk-prototype-kit'),
        destPath: resolve(options.destPath, '../') // Top level (not dist) for compatibility
      })
    )
  ]

  return series(...args)
}
