import { readFile } from 'fs/promises'
import { join, parse } from 'path'

import chalk from 'chalk'
import PluginError from 'plugin-error'
import postcss from 'postcss'
// eslint-disable-next-line import/default
import postcssrc from 'postcss-load-config'
import { compileAsync } from 'sass-embedded'

import { paths, pkg } from '../config/index.js'
import { getListing } from '../lib/file-helper.js'

import { writeAsset } from './compile-assets.mjs'
import { destination, isDist, isPackage, isPublic } from './task-arguments.mjs'

/**
 * Compile Sass to CSS task
 *
 * @returns {Promise<void>}
 */
export async function compileStylesheets () {
  const importEntries = await getImportEntries()

  // Manually add GOV.UK Prototype kit stylesheet
  if (isPackage) {
    importEntries.push(['init.scss', {
      srcPath: join(paths.src, 'govuk-prototype-kit'),
      destPath: join(paths.package, 'govuk-prototype-kit')
    }])
  }

  try {
    await Promise.all(importEntries.map(compileStylesheet))
  } catch (cause) {
    throw new PluginError('compile:scss', cause)
  }
}

compileStylesheets.displayName = 'compile:scss'

/**
 * Compile Sass to CSS helper
 *
 * @param {AssetEntry} assetEntry - Asset entry
 */
export async function compileStylesheet ([modulePath, { srcPath, destPath }]) {
  const moduleSrcPath = join(srcPath, modulePath)
  const moduleDestPath = join(destPath, getPathByDestination(modulePath))

  let css
  let map

  // Configure PostCSS
  const options = {
    from: moduleSrcPath,
    to: moduleDestPath
  }

  // Render Sass
  if (!isPackage) {
    ({ css, sourceMap: map } = await compileAsync(moduleSrcPath, {
      alertColor: true,

      // Turn off dependency warnings
      quietDeps: true,

      // Enable source maps
      sourceMap: true,
      sourceMapIncludeSources: true,

      // Resolve @imports via
      loadPaths: [
        join(paths.node_modules, 'govuk_frontend_toolkit/stylesheets'),
        paths.node_modules
      ],

      // Sass custom logger
      logger: logger({
        suppressed: [
          'Using / for division is deprecated and will be removed in Dart Sass 2.0.0.',
          'Using / for division outside of calc() is deprecated and will be removed in Dart Sass 2.0.0.'
        ]
      }),

      verbose: true
    }))

    // Pass source maps to PostCSS
    options.map = {
      annotation: true,
      inline: false,
      prev: map
    }
  }

  if (!css) {
    css = await readFile(moduleSrcPath)
  }

  // Transform with PostCSS
  const config = await postcssrc(options)
  const result = await postcss(config.plugins)
    .process(css, { ...options, ...config.options })

  // Write to files
  return writeAsset(moduleDestPath, result)
}

/**
 * Stylesheet imports to compile
 *
 * @returns {Promise<AssetEntry[]>} Import entries
 */
export async function getImportEntries () {
  const srcPath = isPublic ? paths.app : join(paths.src, 'govuk')
  const destPath = isPackage ? join(destination, 'govuk') : destination

  // Perform a search and return an array of matching file names
  // but for 'dist' and 'public' we only want top-level stylesheets
  const importPaths = await getListing(srcPath, isPackage
    ? '**/*.scss'
    : '[!_]*.scss'
  )

  return importPaths
    .map((modulePath) => ([modulePath, {
      srcPath,
      destPath
    }]))
}

/**
 * Stylesheet path by destination
 *
 * @param {AssetEntry[0]} filePath - File path
 * @returns {AssetEntry[0]} File path adjusted by destination
 */
export function getPathByDestination (filePath) {
  let { dir, name } = parse(filePath)

  // Adjust file path by destination
  name = isDist ? `${name.replace(/^all/, pkg.name)}-${pkg.version}` : name

  // Adjust file path for minification
  return join(dir, !isPackage
    ? `${name}.min.css`
    : `${name}.scss`)
}

/**
 * Sass custom logger
 *
 * @param {{ suppressed: string[] }} config - Logger config
 * @returns {import('sass-embedded').Logger} Sass logger
 */
export const logger = (config) => ({
  warn (message, options) {
    let log = `${message}\n`

    // Silence Sass suppressed warnings
    if (config.suppressed.some((warning) => log.includes(warning))) {
      return
    }

    // Check for code snippet
    if (options.span) {
      const { context, start, text } = options.span

      // Line number with column width
      const number = start.line + 1
      const column = ' '.repeat(`${number}`.length)

      // Source code warning arrows
      const arrows = '^'.repeat(text.length)
        .padStart(context.indexOf(text) + text.length)

      // Source code snippet showing warning in red
      log += '\n\n'
      log += `${chalk.blue(`${column} ╷`)}\n`
      log += `${chalk.blue(`${number} │`)} ${context.replace(text, chalk.red(text))}`
      log += `${chalk.blue(`${column} │`)} ${chalk.red(arrows)}\n`
      log += `${chalk.blue(`${column} ╵`)}\n`
    }

    // Check for stack trace
    options.stack?.trim().split('\n').forEach((line) => {
      log += `    ${line}\n`
    })

    const title = chalk.bold.yellow(options.deprecation
      ? 'Deprecation Warning'
      : 'Warning')

    console.warn(`${title}: ${log}`)
  }
})

/**
 * @typedef {import('./compile-assets.mjs').AssetEntry} AssetEntry
 * @typedef {import('./compile-assets.mjs').AssetOutput} AssetOutput
 */
