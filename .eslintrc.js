module.exports = {
  extends: 'standard',
  ignorePatterns: [
    '!.*',
    'dist/**/*',
    'node_modules',
    'node_modules/.*',
    'package-lock.json',
    'package/**/*',
    'public/**/*',
    'src/govuk/vendor/polyfills/**/*'
  ],
  overrides: [
    {
      extends: 'plugin:jsdoc/recommended',
      files: ['**/*.{cjs,js,mjs}'],
      plugins: [
        'jsdoc'
      ],
      rules: {
        // JSDoc blocks are optional
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param': 'off',

        // Require hyphens before param description
        // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
        'jsdoc/require-hyphen-before-param-description': 'warn',

        // Check for valid formatting
        'jsdoc/check-line-alignment': 'warn',
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
      files: ['**/*.test.{cjs,js,mjs}'],
      env: {
        jest: true
      }
    }
  ]
}
