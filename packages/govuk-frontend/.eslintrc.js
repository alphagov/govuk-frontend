const { resolve } = require('path')

module.exports = {
  settings: {
    node: {
      version: '^18.12.0'
    }
  },
  overrides: [
    {
      files: ['src/govuk/**/*.mjs'],
      excludedFiles: ['**/*.test.mjs'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: '2015',
        project: [resolve(__dirname, 'tsconfig.dev.json')]
      },
      plugins: ['@typescript-eslint', 'es-x'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:es-x/restrict-to-es2015',
        'prettier'
      ],
      env: {
        browser: true
      },
      rules: {
        // Check type support for template string implicit `.toString()`
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowBoolean: true,
            allowNumber: true
          }
        ],

        // Babel transpiles ES2020 class fields
        'es-x/no-class-fields': 'off',

        // Babel transpiles ES2021 `??=` logical assignment
        'es-x/no-logical-assignment-operators': 'off',

        // Babel transpiles ES2020 `??` nullish coalescing
        'es-x/no-nullish-coalescing-operators': 'off',

        // ES modules include ES2017 'Object.entries()' coverage
        // https://browsersl.ist/#q=supports+es6-module+and+not+supports+object-entries
        'es-x/no-object-entries': 'off',

        // JSDoc blocks are mandatory in source code
        'jsdoc/require-jsdoc': [
          'error',
          {
            enableFixer: false,
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionExpression: true,
              MethodDefinition: true
            }
          }
        ],

        // JSDoc @param required in (mandatory) blocks but
        // @param description is necessary in source code
        'jsdoc/require-param-description': 'warn',
        'jsdoc/require-param': 'error'
      }
    }
  ]
}
