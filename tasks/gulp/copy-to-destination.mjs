import { basename, join } from 'path'

import gulp from 'gulp'
import rename from 'gulp-rename'
import yaml from 'js-yaml'
import map from 'map-stream'
import merge from 'merge-stream'
import nunjucks from 'nunjucks'
import slash from 'slash'

import { paths } from '../../config/index.js'
import { destination } from '../task-arguments.mjs'

/**
 * Copy assets task
 * Copies assets to destination
 *
 * @returns {import('stream').Stream} Output file stream
 */
export function copyAssets () {
  return gulp.src(`${slash(paths.src)}/govuk/assets/**/*`)
    .pipe(gulp.dest(slash(join(destination, 'assets'))))
}

copyAssets.displayName = 'copy:assets'

/**
 * Copy files task
 * Copies files to destination
 *
 * @returns {import('stream').Stream} Output file stream
 */
export function copyFiles () {
  return merge(
    /**
     * Copy files to destination with './govuk-esm' suffix
     * Includes only source JavaScript ECMAScript (ES) modules
     */
    gulp.src([
      `${slash(paths.src)}/govuk/**/*.mjs`,
      `!${slash(paths.src)}/govuk/**/*.test.*`
    ]).pipe(gulp.dest(slash(join(destination, 'govuk-esm')))),

    /**
     * Copy files to destination with './govuk' suffix
     * Includes fonts, images, polyfills, component files
     */
    merge(
      gulp.src([
        `${slash(paths.src)}/**/*`,

        // Exclude files we don't want to publish
        '!**/.DS_Store',
        '!**/*.mjs',
        '!**/*.test.*',
        '!**/__snapshots__/',
        '!**/__snapshots__/**',
        '!**/tsconfig.json',

        // Preserve destination README when copying to ./package
        // https://github.com/alphagov/govuk-frontend/tree/main/package#readme
        `!${slash(paths.src)}/govuk/README.md`,

        // Exclude Sass files handled by Gulp 'compile:scss'
        `!${slash(paths.src)}/**/*.scss`,

        // Exclude source YAML handled by JSON streams below
        `!${slash(paths.src)}/govuk/components/**/*.yaml`
      ]),

      // Generate fixtures.json from ${componentName}.yaml
      gulp.src(`${slash(paths.src)}/govuk/components/**/*.yaml`, {
        base: slash(paths.src)
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
      gulp.src(`${slash(paths.src)}/govuk/components/**/*.yaml`, {
        base: slash(paths.src)
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
    ).pipe(gulp.dest(slash(destination)))
  )
}

copyFiles.displayName = 'copy:files'

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
