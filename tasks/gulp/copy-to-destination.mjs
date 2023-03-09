import { basename, join } from 'path'

import gulp from 'gulp'
import rename from 'gulp-rename'
import yaml from 'js-yaml'
import map from 'map-stream'
import merge from 'merge-stream'
import nunjucks from 'nunjucks'
import slash from 'slash'

import { paths } from '../../config/index.js'

/**
 * Copy assets task
 * Copies assets to destination
 *
 * @param {string} pattern - Minimatch pattern
 * @param {AssetEntry[1]} options - Asset options
 * @returns {() => import('stream').Stream} Output file stream
 */
export function copyAssets (pattern, { srcPath, destPath }) {
  const task = () => gulp.src(`${slash(join(srcPath, pattern))}`)
    .pipe(gulp.dest(slash(destPath)))

  task.displayName = 'copy:assets'

  return task
}

/**
 * Copy files task
 * Copies files to destination
 *
 * @param {AssetEntry[1]} options - Asset options
 * @returns {() => import('stream').Stream} Output file stream
 */
export function copyFiles ({ srcPath, destPath }) {
  const task = () => merge(
    /**
     * Copy files to destination with './govuk-esm' suffix
     * Includes only source JavaScript ECMAScript (ES) modules
     */
    gulp.src(`${slash(srcPath)}/govuk/**/!(*.test).mjs`)
      .pipe(gulp.dest(slash(join(destPath, 'govuk-esm')))),

    /**
     * Copy files to destination with './govuk' suffix
     * Includes fonts, images, polyfills, component files
     */
    merge(
      gulp.src([
        `${slash(srcPath)}/**/*`,

        // Exclude files we don't want to publish
        '!**/.DS_Store',
        '!**/*.mjs',
        '!**/*.test.*',
        '!**/__snapshots__/',
        '!**/__snapshots__/**',
        '!**/tsconfig.json',

        // Preserve destination README when copying to ./package
        // https://github.com/alphagov/govuk-frontend/tree/main/package#readme
        `!${slash(srcPath)}/govuk/README.md`,

        // Exclude Sass files handled by Gulp 'compile:scss'
        `!${slash(srcPath)}/**/*.scss`,

        // Exclude source YAML handled by JSON streams below
        `!${slash(srcPath)}/govuk/components/**/*.yaml`
      ]),

      // Generate fixtures.json from ${componentName}.yaml
      gulp.src(`${slash(srcPath)}/govuk/components/**/*.yaml`, {
        base: slash(srcPath)
      })
        .pipe(map(async (file, done) => {
          try {
            done(null, await generateFixtures(file))
          } catch (error) {
            done(error)
          }
        }))
        .pipe(rename({
          basename: 'fixtures',
          extname: '.json'
        })),

      // Generate macro-options.json from ${componentName}.yaml
      gulp.src(`${slash(srcPath)}/govuk/components/**/*.yaml`, {
        base: slash(srcPath)
      })
        .pipe(map(async (file, done) => {
          try {
            done(null, await generateMacroOptions(file))
          } catch (error) {
            done(error)
          }
        }))
        .pipe(rename({
          basename: 'macro-options',
          extname: '.json'
        }))
    ).pipe(gulp.dest(slash(destPath)))
  )

  task.displayName = 'copy:files'

  return task
}

/**
 * Replace file content with fixtures.json
 *
 * @param {import('vinyl')} file - Component data ${componentName}.yaml
 * @returns {Promise<import('vinyl')>} Component fixtures.json
 */
async function generateFixtures (file) {
  const json = await convertYamlToJson(file)

  if (!json?.examples) {
    throw new Error(`${file.relative} is missing "examples"`)
  }

  // Nunjucks template
  const componentName = basename(file.dirname)
  const template = join(paths.src, 'govuk/components', componentName, 'template.njk')

  // Loop examples
  const examples = json.examples.map(async (example) => {
    const context = { params: example.data }

    return {
      name: example.name,
      options: example.data,
      hidden: Boolean(example.hidden),

      // Wait for render to complete
      html: await new Promise((resolve, reject) => {
        return nunjucks.render(template, context, (error, result) => {
          return error ? reject(error) : resolve(result.trim())
        })
      })
    }
  })

  const fixtures = {
    component: basename(file.dirname),
    fixtures: await Promise.all(examples)
  }

  file.contents = Buffer.from(JSON.stringify(fixtures, null, 4))
  return file
}

/**
 * Replace file content with macro-options.json
 *
 * @param {import('vinyl')} file - Component data ${componentName}.yaml
 * @returns {Promise<import('vinyl')>} Component macro-options.json
 */
async function generateMacroOptions (file) {
  const json = await convertYamlToJson(file)

  if (!json?.params) {
    throw new Error(`${file.relative} is missing "params"`)
  }

  file.contents = Buffer.from(JSON.stringify(json.params, null, 4))
  return file
}

/**
 * Parse YAML file content as JavaScript
 *
 * @param {import('vinyl')} file - Component data ${componentName}.yaml
 * @returns {Promise<{ examples?: Record<string, unknown>[]; params?: Record<string, unknown>[] }>} Component options
 */
async function convertYamlToJson (file) {
  return yaml.load(file.contents.toString(), { json: true })
}

/**
 * @typedef {import('../compile-assets.mjs').AssetEntry} AssetEntry
 */
