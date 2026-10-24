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
    'custom-property-pattern': [
      '^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) =>
          `Expected custom property name "${name}" to be kebab-case, possibly starting with an \`_\` if it is private`
      }
    ],
    /**
     * GOV.UK Frontend has a specific ordering pattern
     * that should be applied to rules
     *
     * https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-order/README.md
     */
    'order/properties-order': [
      [
        {
          // Properties that reset or remove user agent styles
          properties: [
            'all',
            'appearance',
            '-webkit-appearance',
            'color-scheme'
          ]
        },
        {
          // Generated content
          properties: [
            'counter',
            'counter-set',
            'counter-increment',
            'counter-reset',

            'content',
            'content-visibility',

            'quotes'
          ]
        },
        {
          // CSS containers
          properties: ['container', 'container-name', 'container-type']
        },
        {
          // box-sizing affects a lot of what's to follow
          properties: ['box-sizing']
        },
        {
          // Display
          properties: ['display', 'visibility']
        },
        {
          // Positioning properties
          properties: [
            'position',
            'isolation',
            'z-index',

            'inset',
            'top',
            'right',
            'bottom',
            'left',
            'inset-inline',
            'inset-block',
            'inset-inline-start',
            'inset-inline-end',
            'inset-block-start',
            'inset-block-end',

            'anchor-name',
            'anchor-scope',
            'position-anchor',
            'position-area',
            'position-try',
            'position-try-fallbacks',
            'position-try-order',
            'position-visibility'
          ]
        },
        {
          // Baseline alignment and direction
          properties: [
            'dominant-baseline',
            'vertical-align',
            'alignment-baseline',
            'baseline-source',
            'baseline-shift',

            'direction',
            'writing-mode'
          ]
        },
        {
          // Flexbox layout
          properties: [
            'flex',
            'flex-basis',
            'flex-direction',
            'flex-flow',
            'flex-grow',
            'flex-line-count',
            'flex-shrink',
            'flex-wrap',
            'align-content',
            'align-items',
            'align-self',
            'justify-content',
            'justify-items',
            'justify-self',
            'order'
          ]
        },
        {
          // Grid layout
          properties: [
            'grid',
            'grid-area',
            'grid-auto-flow',
            'grid-auto-columns',
            'grid-auto-rows',
            'grid-column',
            'grid-column-start',
            'grid-column-end',
            'grid-row',
            'grid-row-start',
            'grid-row-end',
            'grid-template',
            'grid-template-areas',
            'grid-template-columns',
            'grid-template-rows'
          ]
        },
        {
          // Multi-column layout
          properties: [
            'columns',
            'column-count',
            'column-fill',
            'column-span',
            'column-width',
            'column-wrap'
          ]
        },
        {
          // Gap (for flexbox, grid, and multi-column)
          properties: ['gap', 'column-gap', 'row-gap']
        },
        {
          // Gutter rules (for flexbox, grid, and multi-column)
          properties: [
            'rule',
            'rule-color',
            'rule-style',
            'rule-width',
            'rule-inset-cap',
            'rule-inset-junction',
            'rule-visibility-items',
            'rule-overlap',

            'column-rule',
            'column-rule-break',
            'column-rule-color',
            'column-rule-style',
            'column-rule-width',
            'column-rule-inset-cap',
            'column-rule-inset-cap-start',
            'column-rule-inset-cap-end',
            'column-rule-inset-junction',
            'column-rule-inset-junction-end',
            'column-rule-visibility-items',

            'row-rule',
            'row-rule-break',
            'row-rule-color',
            'row-rule-style',
            'row-rule-width',
            'row-rule-inset-cap',
            'row-rule-inset-cap',
            'row-rule-inset-cap-start',
            'row-rule-inset-cap-end',
            'row-rule-inset-junction',
            'row-rule-visibility-items'
          ]
        },
        {
          // Content placement (for flexbox and grid)
          properties: ['place-content', 'place-items', 'place-self']
        },
        {
          // Content break handlers in paged and multi-column content
          properties: [
            'break-inside',
            'break-before',
            'break-after',
            'orphans',
            'widows'
          ]
        },
        {
          // Paged media-specific properties
          properties: ['page']
        },
        {
          // Width and height
          properties: [
            'width',
            'min-width',
            'max-width',
            'inline-size',
            'min-inline-size',
            'max-inline-size',

            'height',
            'min-height',
            'max-height',
            'block-size',
            'min-block-size',
            'max-block-size',

            'aspect-ratio',

            'contain',
            'contain-intrinsic-size',
            'contain-intrinsic-width',
            'contain-intrinsic-height',
            'contain-intrinsic-inline-size',
            'contain-intrinsic-block-size'
          ]
        },
        {
          // Margins and padding
          properties: [
            'margin',
            'margin-inline',
            'margin-block',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'margin-inline-start',
            'margin-inline-end',
            'margin-block-start',
            'margin-block-end',
            'margin-trim',

            'padding',
            'padding-inline',
            'padding-block',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'padding-inline-start',
            'padding-inline-end',
            'padding-block-start',
            'padding-block-end'
          ]
        },
        {
          // Borders and outlines
          properties: [
            'border',
            'border-inline',
            'border-block',

            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-inline-start',
            'border-inline-end',
            'border-block-start',
            'border-block-end',

            'border-width',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'border-inline-width',
            'border-inline-start-width',
            'border-inline-end-width',
            'border-block-width',
            'border-block-start-width',
            'border-block-end-width',

            'border-style',
            'border-top-style',
            'border-right-style',
            'border-bottom-style',
            'border-left-style',
            'border-inline-style',
            'border-inline-start-style',
            'border-inline-end-style',
            'border-block-style',
            'border-block-start-style',
            'border-block-end-style',

            'corner-shape',
            'corner-top-shape',
            'corner-right-shape',
            'corner-bottom-shape',
            'corner-left-shape',
            'corner-top-left-shape',
            'corner-top-right-shape',
            'corner-bottom-left-shape',
            'corner-bottom-right-shape',
            'corner-start-start-shape',
            'corner-start-end-shape',
            'corner-end-start-shape',
            'corner-end-end-shape',

            'border-radius',
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-left-radius',
            'border-bottom-right-radius',
            'border-start-start-radius',
            'border-start-end-radius',
            'border-end-start-radius',
            'border-end-end-radius',

            'border-color',
            'border-inline-color',
            'border-block-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',

            'border-image',
            'border-image-source',
            'border-image-width',
            'border-image-slice',
            'border-image-repeat',
            'border-image-outset',

            'outline',
            'outline-color',
            'outline-offset',
            'outline-style',
            'outline-width'
          ]
        },
        {
          // Floated elements
          properties: ['float', 'clear']
        },
        {
          // Scrolling content
          properties: [
            'overflow',
            'overflow-x',
            'overflow-y',
            'overflow-inline',
            'overflow-block',

            'overflow-anchor',
            'overflow-clip-margin',
            'overflow-wrap',

            'overscroll-behavior',
            'overscroll-behavior-x',
            'overscroll-behavior-y',
            'overscroll-behavior-inline',
            'overscroll-behavior-block',

            'scroll-behavior',
            'scroll-snap-type',
            'scroll-snap-align',
            'scroll-snap-stop',
            'scroll-initial-target',
            'scroll-marker-group',
            'scroll-target-group',

            'scroll-margin',
            'scroll-margin-inline',
            'scroll-margin-block',
            'scroll-margin-top',
            'scroll-margin-right',
            'scroll-margin-bottom',
            'scroll-margin-left',
            'scroll-margin-inline-start',
            'scroll-margin-inline-end',
            'scroll-margin-block-start',
            'scroll-margin-block-end',

            'scroll-padding',
            'scroll-padding-inline',
            'scroll-padding-block',
            'scroll-padding-top',
            'scroll-padding-right',
            'scroll-padding-bottom',
            'scroll-padding-left',
            'scroll-padding-inline-start',
            'scroll-padding-inline-end',
            'scroll-padding-block-start',
            'scroll-padding-block-end',

            'scroll-timeline',
            'scroll-timeline-name',
            'scroll-timeline-axis'
          ]
        },
        {
          // Colors and backgrounds
          properties: [
            'color',
            'background',
            'background-color',
            'background-image',
            'background-repeat',
            'background-repeat-x',
            'background-repeat-y',
            'background-position',
            'background-position-x',
            'background-position-y',
            'background-origin',
            'background-size',
            'background-attachment',
            'background-clip',
            'background-blend-mode',

            'box-decoration-break',
            'box-shadow',

            // SVG specific
            'fill',
            'fill-rule',
            'fill-opacity',

            'forced-color-adjust',
            'print-color-adjust'
          ]
        },
        {
          // Typography
          properties: [
            'font',
            'font-family',
            'font-feature-settings',
            'font-kerning',
            'font-language-override',
            'font-optical-sizing',
            'font-palette',
            'font-size',
            'font-size-adjust',
            'font-stretch',
            'font-style',
            'font-synthesis',
            'font-synthesis-position',
            'font-synthesis-small-caps',
            'font-synthesis-style',
            'font-synthesis-weight',
            'font-variant',
            'font-variant-alternatives',
            'font-variant-caps',
            'font-variant-east-asian',
            'font-variant-emoji',
            'font-variant-ligatures',
            'font-variant-numeric',
            'font-variant-position',
            'font-variation-settings',
            'font-weight',
            'font-width',
            'font-display',
            'src',

            'text-align',
            'text-align-last',
            'text-box',
            'text-box-edge',
            'text-box-trim',
            'text-decoration',
            'text-decoration-inset',
            'text-decoration-line',
            'text-decoration-thickness',
            'text-decoration-style',
            'text-decoration-color',
            'text-decoration-skip-ink',
            'text-decoration-skip',
            'text-underline-offset',
            'text-underline-position',
            'text-fit',
            'text-indent',
            'text-justify',
            'text-overflow',
            'text-rendering',
            'text-shadow',
            'text-size-adjust',
            'text-transform',

            // Line height
            'line-break',
            'line-clamp',
            'line-height',
            'line-height-step',

            // MathML specific
            'math-depth',
            'math-shift',
            'math-style',

            // Whitespace control
            'white-space',
            'white-space-collapse',
            'text-wrap',
            'text-wrap-mode',
            'text-wrap-style',
            'tab-size',

            // Hyphenation and word splitting
            'hyphens',
            'hyphenate-character',
            'hyphenate-limit-chars',
            'word-wrap', // legacy, replaced by `overflow-wrap`
            'overflow-wrap',
            'word-break',

            // Non-Latin alphabet-specific
            'text-autospace',
            'text-combine-upright',
            'text-emphasis',
            'text-emphasis-color',
            'text-emphasis-position',
            'text-emphasis-style',
            'text-spacing-trim',
            'ruby-align',
            'ruby-overhang',
            'ruby-position',
            'unicode-bidi',

            'hanging-punctuation',
            'initial-letter',
            'letter-spacing',
            'word-spacing'
          ]
        },
        {
          // Embedded content properties
          properties: [
            // Iframes
            'frame-sizing',

            // Images
            'dynamic-range-limit',
            'image-orientation',
            'image-rendering',
            'image-resolution',
            'object-fit',
            'object-position',
            'object-view-box',

            // SVG
            'link-parameters'
          ]
        },
        {
          // Form input-specific properties
          properties: [
            'resize',
            'field-sizing',
            'accent-color',

            'caret',
            'caret-shape',
            'caret-color',
            'caret-animation'
          ]
        },
        {
          // Table-specific properties
          properties: [
            'table-layout',
            'empty-cells',
            'caption-side',
            'border-collapse',
            'border-spacing'
          ]
        },
        {
          // List-specific properties
          properties: [
            'list-style',
            'list-style-position',
            'list-style-type',
            'list-style-image'
          ]
        },
        {
          // Transforms and visual affects
          properties: [
            'transform',
            'transform-box',
            'transform-origin',
            'transform-style',
            'rotate',
            'scale',
            'translate',

            // 3D transform specific
            'perspective',
            'perspective-origin',
            'backface-visibility',

            'filter',
            'backdrop-filter',
            'mix-blend-mode',
            'opacity',
            'zoom'
          ]
        },
        {
          // Masking, clipping and shaping
          properties: [
            'border-shape',

            'clip',
            'clip-path',
            'clip-rule',

            'mask',
            'mask-border',
            'mask-border-mode',
            'mask-border-outset',
            'mask-border-repeat',
            'mask-border-slice',
            'mask-border-source',
            'mask-border-width',
            'mask-clip',
            'mask-composite',
            'mask-image',
            'mask-mode',
            'mask-origin',
            'mask-repeat',
            'mask-position',
            'mask-size',
            'mask-type',

            'shape-outside',
            'shape-image-threshold',
            'shape-margin'
          ]
        },
        {
          // Motion, animation and transitions
          properties: [
            'transition',
            'transition-property',
            'transition-duration',
            'transition-timing-function',
            'transition-delay',

            'animation',
            'animation-name',
            'animation-duration',
            'animation-timing-function',
            'animation-delay',
            'animation-iteration-count',
            'animation-direction',
            'animation-play-state',
            'animation-fill-mode',
            'animation-composition',

            // Scroll-based animation properties
            'animation-timeline',
            'animation-range',
            'animation-range-start',
            'animation-range-end',
            'animation-trigger',
            'timeline-scope',
            'timeline-trigger',
            'timeline-trigger-name',
            'timeline-trigger-source',
            'timeline-trigger-activation-range',
            'timeline-trigger-activation-range-start',
            'timeline-trigger-activation-range-end',
            'timeline-trigger-active-range',
            'timeline-trigger-active-range-start',
            'timeline-trigger-active-range-end',

            // View transitions
            'view-timeline',
            'view-timeline-name',
            'view-timeline-axis',
            'view-timeline-inset',
            'view-timeline-transition-name',
            'view-timeline-transition-class',
            'view-timeline-transition-scope',

            // Path animation properties
            'offset',
            'offset-anchor',
            'offset-distance',
            'offset-path',
            'offset-position',
            'offset-rotate',

            'transition-behaviour',
            'overlay',
            'interpolate-size',
            'will-change'
          ]
        },
        {
          // Interest invokers
          properties: [
            'interest-delay',
            'interest-delay-start',
            'interest-delay-end'
          ]
        },
        {
          // Properties that change how the user can interact with page content
          properties: [
            'interactivity',

            // Pointer-specific properties
            'pointer-events',
            'touch-action',
            'user-select',

            // Screen reader-specific properties
            'reading-flow',
            'reading-order',
            'speak-as'
          ]
        },
        {
          // Properties that change how the browser renders native elements
          properties: [
            'cursor',
            'scrollbar-color',
            'scrollbar-gutter',
            'scrollbar-width'
          ]
        }
      ]
    ],
    'scss/function-disallowed-list': ['if'],
    'scss/no-global-function-names': true
  }
}
