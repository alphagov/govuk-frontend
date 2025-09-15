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
     * GOV.UK Frontend has a specific ordering pattern
     * that should be applied to rules
     *
     * https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-order/README.md
     */
    'order/properties-order': [
      [
        {
          emptyLineBefore: 'threshold',
          properties: ['content', 'quotes']
        },
        {
          // Box-sizing - Allow here until global is decided
          emptyLineBefore: 'threshold',
          properties: ['box-sizing']
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['display', 'visibility']
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['position', 'z-index', 'top', 'right', 'bottom', 'left']
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
            'flex',
            'flex-basis',
            'flex-direction',
            'flex-flow',
            'flex-grow',
            'flex-shrink',
            'flex-wrap',
            'align-content',
            'align-items',
            'align-self',
            'justify-content',
            'order',

            'grid',
            'grid-area',
            'grid-auto-columns',
            'grid-auto-flow',
            'grid-auto-rows',
            'grid-column',
            'grid-column-end',
            'grid-column-start',
            'grid-row',
            'grid-row-end',
            'grid-row-start',
            'grid-template',
            'grid-template-areas',
            'grid-template-columns',
            'grid-template-rows',

            'columns',
            'column-count',
            'column-fill',
            'column-gap',
            'column-rule',
            'column-rule-color',
            'column-rule-style',
            'column-rule-width',
            'column-span',
            'column-width',
            'row-gap'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
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
            'padding-left'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['float', 'clear', 'overflow', 'overflow-x', 'overflow-y']
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['clip', 'clip-path', 'zoom', 'resize']
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
            'table-layout',
            'empty-cells',
            'caption-side',
            'border-spacing',
            'border-collapse'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
            'list-style',
            'list-style-position',
            'list-style-type',
            'list-style-image'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['transform', 'transition', 'animation']
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
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
            'outline-width'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['opacity']
        },
        {
          // Color has been moved to ensure it appears before background
          emptyLineBefore: 'threshold',
          properties: [
            'color',
            'background',
            'background-color',
            'background-image',
            'background-repeat',
            'background-position',
            'background-size',
            'box-shadow',
            'fill'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: [
            'font',
            'font-family',
            'font-size',
            'font-style',
            'font-variant',
            'font-weight',
            'font-emphasize',

            'letter-spacing',
            'line-height',
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
            'hyphens'
          ]
        },
        {
          emptyLineBefore: 'threshold',
          properties: ['src', 'cursor', '-webkit-appearance']
        }
      ],
      {
        emptyLineBeforeUnspecified: 'threshold',
        emptyLineMinimumPropertyThreshold: 6
      }
    ]
  }
}
