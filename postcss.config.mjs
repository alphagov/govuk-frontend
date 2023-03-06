import { parse } from 'path'

import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import cssnanoPresetDefault from 'cssnano-preset-default'
import { minimatch } from 'minimatch'
import postcss from 'postcss'
import pseudoclasses from 'postcss-pseudo-classes'
import scss from 'postcss-scss'
import unmq from 'postcss-unmq'
import unopacity from 'postcss-unopacity'
import unrgba from 'postcss-unrgba'

/**
 * PostCSS config
 *
 * @param {import('postcss-load-config').ConfigContext} ctx - PostCSS context
 * @returns {import('postcss-load-config').Config} PostCSS config
 */
export default (ctx) => {
  const plugins = []
  const syntax = ctx.to?.endsWith('.scss') ? scss : postcss

  // PostCSS 'from' (or webpack 'file') source path
  // https://github.com/postcss/postcss-load-config#options
  const { dir, name } = parse(ctx.from || ctx.file || '')

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
  if (syntax !== scss) {
    plugins.push(cssnano({
      preset: [cssnanoPresetDefault, {
        // Sorted CSS is smaller when gzipped, but we sort using Stylelint
        // https://cssnano.co/docs/optimisations/cssdeclarationsorter/
        cssDeclarationSorter: false
      }]
    }))
  }

  return {
    syntax,
    plugins
  }
}
