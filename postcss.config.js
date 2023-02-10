const { parse } = require('path')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const cssnanoPresetDefault = require('cssnano-preset-default')
const { minimatch } = require('minimatch')
const pseudoclasses = require('postcss-pseudo-classes')
const unmq = require('postcss-unmq')
const unopacity = require('postcss-unopacity')
const unrgba = require('postcss-unrgba')

/**
 * PostCSS config
 *
 * @param {import('postcss-load-config').ConfigContext} ctx - PostCSS context
 * @returns {import('postcss-load-config').Config} PostCSS config
 */
module.exports = (ctx) => {
  const plugins = []

  // PostCSS 'from' source path
  // https://github.com/postcss/postcss-load-config#options
  const file = ctx.from || ctx.file || ''

  // Handle non-standard `file` source path
  const { dir, name } = parse(typeof file === 'object'
    ? file.path // Vinyl file object (Gulp)
    : file
  )

  // IE8 stylesheets
  const isIE8 = name?.endsWith('-ie8') || name?.endsWith('-ie8.min')

  // Add vendor prefixes
  plugins.push(autoprefixer({
    env: isIE8 ? 'oldie' : ctx.env
  }))

  // Add review app auto-generated 'companion' classes for each pseudo-class
  // For example ':hover' and ':focus' classes to simulate form label states
  if (minimatch(dir, '**/app/stylesheets')) {
    plugins.push(pseudoclasses({
      allCombinations: true,
      restrictTo: [
        ':link',
        ':visited',
        ':hover',
        ':active',
        ':focus'
      ]
    }))
  }

  // Transpile CSS for Internet Explorer
  if (isIE8) {
    plugins.push(
      unmq(),
      unopacity({ browsers: 'ie 8' }),
      unrgba({ filter: true })
    )
  }

  // Always minify CSS
  plugins.push(cssnano({
    preset: [cssnanoPresetDefault, {
      // Sorted CSS is smaller when gzipped, but we sort using Stylelint
      // https://cssnano.co/docs/optimisations/cssdeclarationsorter/
      cssDeclarationSorter: false
    }]
  }))

  return {
    plugins
  }
}
