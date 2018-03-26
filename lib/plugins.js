'use strict'

module.exports = {
  plugins: {
    'autoprefixer': require('autoprefixer'),
    'cssnano': require('cssnano'),
    'postcsspseudoclasses': require('postcss-pseudo-classes'),
    'postcssnormalize': require('postcss-pseudo-classes'),
    'postcssoldie': require('oldie')({
      rgba: {filter: true},
      rem: {disable: true},
      unmq: {disable: true},
      pseudo: {disable: true} // we're mixing singlre and double colons so this is disabled for now
    })
  }
}
