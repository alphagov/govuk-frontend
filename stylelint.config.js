module.exports = {
  extends: 'stylelint-config-gds/scss',
  ignoreFiles: [
    '**/dist/**',
    '**/vendor/**',

    // Ignore CSS-in-JS (including dotfiles)
    '**/?(.)*.{cjs,js,mjs}',

    // Legacy source symlinks
    'src/govuk/**',
    'src/govuk-prototype-kit/**',

    // Prevent CHANGELOG history changes
    'CHANGELOG.md'
  ],
  overrides: [
    {
      customSyntax: 'postcss-markdown',
      files: ['**/*.md']
    },
    {
      customSyntax: 'postcss-markdown',
      files: ['**/coding-standards/css.md'],
      rules: {
        // Allow markdown `*.md` CSS bad examples
        'block-no-empty': null,
        'color-hex-length': null,
        'declaration-block-single-line-max-declarations': null,
        'length-zero-no-unit': null,
        'rule-empty-line-before': null,
        'selector-max-id': null,
        'shorthand-property-no-redundant-values': null,

        // Allow markdown `*.md` Sass bad examples
        'scss/at-if-no-null': null,
        'scss/at-import-no-partial-leading-underscore': null,
        'scss/at-import-partial-extension': null,
        'scss/at-mixin-pattern': null,
        'scss/at-rule-conditional-no-parentheses': null,
        'scss/load-no-partial-leading-underscore': null,
        'scss/operator-no-unspaced': null
      }
    },
    {
      customSyntax: 'postcss-scss',
      files: ['**/*.scss']
    }
  ],
  plugins: ['stylelint-order'],
  rules: {
    /**
     * Relax custom property pattern to allow a leading `_`,
     * enabling to mark some properties private by convention
     */
    'custom-property-pattern': [
      '^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) =>
          `Expected custom property name "${name}" to be kebab-case`
      }
    ],
    /**
     * GOV.UK Frontend has a specific ordering pattern
     * that should be applied to rules
     *
     * https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-order/README.md
     */
    'order/properties-order': [
      'content',
      'quotes',

      // Box-sizing - Allow here until global is decided
      'box-sizing',

      'display',
      'visibility',

      'position',
      'z-index',
      'top',
      'right',
      'bottom',
      'left',

      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',

      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',

      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',

      'float',
      'clear',

      'overflow',
      'overflow-x',
      'overflow-y',

      'clip',
      'clip-path',
      'zoom',
      'resize',

      'columns',

      'table-layout',
      'empty-cells',
      'caption-side',
      'border-spacing',
      'border-collapse',

      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',

      'transform',
      'transition',
      'animation',

      'border',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',

      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',

      'border-style',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',

      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-left-radius',
      'border-bottom-right-radius',

      'border-color',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',

      'outline',
      'outline-color',
      'outline-offset',
      'outline-style',
      'outline-width',

      'opacity',

      // Color has been moved to ensure it appears before background
      'color',
      'background',
      'background-color',
      'background-image',
      'background-repeat',
      'background-position',
      'background-size',
      'box-shadow',
      'fill',

      'font',
      'font-family',
      'font-size',
      'font-style',
      'font-variant',
      'font-weight',

      'font-emphasize',

      'letter-spacing',
      'line-height',
      'list-style',
      'word-spacing',

      'text-align',
      'text-align-last',
      'text-decoration',
      'text-indent',
      'text-justify',
      'text-overflow',
      'text-overflow-ellipsis',
      'text-overflow-mode',
      'text-rendering',
      'text-outline',
      'text-shadow',
      'text-transform',
      'text-wrap',
      'word-wrap',
      'word-break',

      'text-emphasis',

      'vertical-align',
      'white-space',
      'word-spacing',
      'hyphens',

      'src',
      'cursor',
      '-webkit-appearance'
    ]
  }
}
