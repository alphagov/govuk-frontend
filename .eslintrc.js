module.exports = {
  extends: 'standard',
  ignorePatterns: [
    '**/dist/**',
    '**/package/**',
    '**/vendor/**',

    // Enable dotfile linting
    '!.*',
    'node_modules',
    'node_modules/.*'
  ],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:jsdoc/recommended',
        'plugin:n/recommended',
        'plugin:promise/recommended'
      ],
      files: ['**/*.{cjs,js,mjs}'],
      parserOptions: {
        ecmaVersion: 'latest'
      },
      plugins: [
        'import',
        'jsdoc',
        'n',
        'promise'
      ],
      rules: {
        // Check import or require statements are A-Z ordered
        'import/order': [
          'error',
          {
            alphabetize: { order: 'asc' },
            'newlines-between': 'always'
          }
        ],

        // JSDoc blocks are optional
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param': 'off',

        // Require hyphens before param description
        // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
        'jsdoc/require-hyphen-before-param-description': 'warn',

        // Check for valid formatting
        'jsdoc/check-line-alignment': [
          'warn',
          'never', {
            wrapIndent: '  '
          }
        ],
        'jsdoc/check-syntax': 'error',

        // Add unknown @jest-environment tag name
        'jsdoc/check-tag-names': [
          'warn', {
            definedTags: ['jest-environment']
          }
        ],

        // Add missing .querySelectorAll() type
        'jsdoc/no-undefined-types': [
          'error', {
            definedTypes: ['NodeListOf']
          }
        ],

        // Maintain new line after description
        'jsdoc/tag-lines': [
          'warn',
          'never', {
            startLines: 1
          }
        ]
      },
      settings: {
        jsdoc: {
          // Allows us to use type declarations that exist in our dependencies
          mode: 'typescript'
        }
      }
    },
    {
      // Extensions required for ESM import
      files: ['**/*.mjs'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            ignorePackages: true,
            pattern: {
              cjs: 'always',
              js: 'always',
              mjs: 'always'
            }
          }
        ]
      }
    },
    {
      files: ['**/*.test.{cjs,js,mjs}'],
      env: {
        jest: true
      }
    }
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  root: true
}
