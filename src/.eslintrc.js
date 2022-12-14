module.exports = {
  overrides: [
    {
      files: ['**/*.{cjs,js,mjs}'],
      excludedFiles: ['**/*.test.{cjs,js,mjs}'],
      env: {
        browser: true
      },
      rules: {
        'no-var': 'off',

        // JSDoc blocks are mandatory
        'jsdoc/require-jsdoc': [
          'error', {
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionExpression: true,
              MethodDefinition: true
            }
          }
        ]
      }
    },
    {
      // Matches 'JavaScript component tests' in jest.config.mjs
      // to ignore unknown 'page' and 'browser' Puppeteer globals
      files: [
        '**/all.test.{js,mjs}',
        '**/components/*/*.test.{js,mjs}'
      ],
      excludedFiles: [
        '**/(*.)?template.test.{js,mjs}',
        '**/*.unit.test.{js,mjs}'
      ],
      globals: {
        page: true,
        browser: true
      }
    }
  ]
}
