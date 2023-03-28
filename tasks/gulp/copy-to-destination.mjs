import { basename, join } from 'path'

import gulp from 'gulp'
import rename from 'gulp-rename'
import yaml from 'js-yaml'
import map from 'map-stream'
import nunjucks from 'nunjucks'
import slash from 'slash'

import { paths } from '../../config/index.js'

/**
 * Generate fixtures.json from ${componentName}.yaml
 *
 * @param {AssetEntry[1]} options - Asset options
 * @returns {import('stream').Stream} Output file stream
 */
export function generateFixtures ({ srcPath, destPath }) {
  return gulp.src(`${slash(srcPath)}/govuk/components/**/*.yaml`, {
    base: slash(srcPath)
  })
    .pipe(map(async (file, done) => {
      try {
        done(null, await generateFixture(file))
      } catch (error) {
        done(error)
      }
    }))
    .pipe(rename({
      basename: 'fixtures',
      extname: '.json'
    }))
    .pipe(gulp.dest(slash(destPath)))
}

/**
 * Generate macro-options.json from ${componentName}.yaml
 *
 * @param {AssetEntry[1]} options - Asset options
 * @returns {import('stream').Stream} Output file stream
 */
export function generateMacroOptions ({ srcPath, destPath }) {
  return gulp.src(`${slash(srcPath)}/govuk/components/**/*.yaml`, {
    base: slash(srcPath)
  })
    .pipe(map(async (file, done) => {
      try {
        done(null, await generateMacroOption(file))
      } catch (error) {
        done(error)
      }
    }))
    .pipe(rename({
      basename: 'macro-options',
      extname: '.json'
    }))
    .pipe(gulp.dest(slash(destPath)))
}

/**
 * Replace file content with fixtures.json
 *
 * @param {import('vinyl')} file - Component data ${componentName}.yaml
 * @returns {Promise<import('vinyl')>} Component fixtures.json
 */
async function generateFixture (file) {
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
async function generateMacroOption (file) {
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
 * @typedef {import('../assets.mjs').AssetEntry} AssetEntry
 */
