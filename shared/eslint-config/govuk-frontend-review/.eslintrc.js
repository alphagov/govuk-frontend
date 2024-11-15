const { join } = require('path')

module.exports = {
  overrides: [
    {
      files: ['**/*.mjs'],
      excludedFiles: ['**/*.test.mjs'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [join(__dirname, 'tsconfig.dev.json')]
      },
      plugins: ['@typescript-eslint']
    }
  ]
}
