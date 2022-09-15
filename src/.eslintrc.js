module.exports = {
  overrides: [
    {
      files: [
        '!**/*.test.{cjs,js,mjs}',
        '**/*.{cjs,js,mjs}'
      ],
      env: {
        browser: true
      },
      rules: {
        'no-var': 'off'
      }
    },
    {
      files: [
        '!**/template.test.js',
        '**/*.test.js'
      ],
      globals: {
        page: true,
        browser: true
      }
    }
  ]
}
