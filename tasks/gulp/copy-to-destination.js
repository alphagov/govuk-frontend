const { basename, join } = require('path')

const nunjucks = require('nunjucks')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const postcssScss = require('postcss-scss')
const autoprefixer = require('autoprefixer')
const yaml = require('js-yaml')
const map = require('map-stream')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const slash = require('slash')

const configPaths = require('../../config/paths.js')
const { destination } = require('../task-arguments.js')

gulp.task('copy:files', () => {
  return merge(
    /**
     * Copy files to destination with './govuk-esm' suffix
     * Includes only source JavaScript ECMAScript (ES) modules
     */
    gulp.src([
      `${configPaths.src}**/*.mjs`,
      `!${configPaths.src}**/*.test.*`
    ]).pipe(gulp.dest(slash(join(destination, 'govuk-esm')))),

    /**
     * Copy files to destination with './govuk' suffix
     * Includes fonts, images, polyfills, component files
     */
    merge(
      gulp.src([
        `${configPaths.src}**/*`,

        // Exclude files we don't want to publish
        '!**/.DS_Store',
        '!**/*.mjs',
        '!**/*.test.*',
        '!**/__snapshots__/',
        '!**/__snapshots__/**',

        // Preserve destination README when copying to ./package
        // https://github.com/alphagov/govuk-frontend/tree/main/package#readme
        `!${configPaths.src}README.md`,

        // Exclude Sass files handled by PostCSS stream below
        `!${configPaths.src}**/*.scss`,

        // Exclude source YAML handled by JSON streams below
        `!${configPaths.components}**/*.yaml`
      ]),

      // Add CSS prefixes to Sass
      gulp.src(`${configPaths.src}**/*.scss`)
        .pipe(postcss([autoprefixer], { syntax: postcssScss })),

      // Generate fixtures.json from ${componentName}.yaml
      gulp.src(`${configPaths.components}**/*.yaml`, { base: configPaths.src })
        .pipe(map((file, done) =>
          generateFixtures(file)
            .then((fixture) => done(null, fixture))
            .catch(done)
        ))
        .pipe(rename({
          basename: 'fixtures',
          extname: '.json'
        })),

      // Generate macro-options.json from ${componentName}.yaml
      gulp.src(`${configPaths.components}**/*.yaml`, { base: configPaths.src })
        .pipe(map((file, done) =>
          generateMacroOptions(file)
            .then((macro) => done(null, macro))
            .catch(done)
        ))
        .pipe(rename({
          basename: 'macro-options',
          extname: '.json'
        }))
    ).pipe(gulp.dest(slash(join(destination, 'govuk'))))
  )
})

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
  const template = join(configPaths.components, componentName, 'template.njk')

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
 * @returns {Promise<{ examples?: unknown[]; params?: unknown[] }>} Component options
 */
async function convertYamlToJson (file) {
  const cache = convertYamlToJson.cache ??= new Map()

  // Check cache for component options
  if (!cache.has(file.relative)) {
    cache.set(file.relative, yaml.load(file.contents.toString(), { json: true }))
  }

  // Use cached content
  return cache.get(file.relative)
}
